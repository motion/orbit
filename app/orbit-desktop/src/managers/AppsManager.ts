import { Oracle } from '@mcro/oracle'
import { store, react } from '@mcro/black'
import { App, Desktop, Electron } from '@mcro/stores'
import { oracleOptions } from '../constants'
import { Logger } from '@mcro/logger'
import { join } from 'path'
import { getGlobalConfig } from '@mcro/config'
import { stringify } from '@mcro/helpers'

const log = new Logger('AppsManager')

type FakeProcess = {
  id: number
  oracle: Oracle
}

// @ts-ignore
@store
export class AppsManager {
  processes: FakeProcess[] = []

  async dispose() {
    await Promise.all(this.processes.map(x => x.oracle.stop()))
  }

  // launch app icons and events to listen for focus
  manageAppIcons = react(
    () => App.appsState.map(app => ({ id: app.id, torn: app.torn })),
    async (apps, { sleep }) => {
      // debounce to prevent lots of processing
      await sleep(50)
      log.info('Running app state', apps)
      // handle deletes
      let current = [...this.processes]
      for (const { id } of current) {
        const hasApp = apps.find(x => x.id === id)
        const shouldDelete = !hasApp
        if (shouldDelete) {
          log.info(`remove process ${id}`)
          await this.removeProcess(id)
        }
      }

      // handle adds
      for (const { id, torn } of apps) {
        // dont handle peek app
        if (torn === false) {
          continue
        }
        const shouldAdd = !this.processes.find(x => x.id === id)
        if (shouldAdd) {
          log.info(`create process ${id}`)
          const icon = join(getGlobalConfig().paths.desktopRoot, 'assets', 'icon.png')
          const oracle = await this.spawnOracle(id, 'Test', icon)
          this.processes = [
            ...this.processes,
            {
              id,
              oracle,
            },
          ]
        }
      }
    },
  )

  async spawnOracle(id, name, iconPath: string) {
    const oracle = new Oracle({
      name,
      ...oracleOptions,
      env: { SHOW_ICON: iconPath },
    })
    await oracle.start()
    log.verbose('spawnOracle', id, name)
    oracle.onAppState(this.handleAppState(id))
    return oracle
  }

  handleAppState = id => (action: string) => {
    Desktop.sendMessage(Electron, Electron.messages.APP_STATE, JSON.stringify({ id, action }))
  }

  async removeProcess(id: number) {
    const index = this.processes.findIndex(x => x.id === id)
    await this.processes[index].oracle.stop()
    this.processes.splice(index, 1)
    log.verbose('removeProcess', id)
  }
}
