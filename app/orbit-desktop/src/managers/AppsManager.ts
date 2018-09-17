import { Oracle } from '@mcro/oracle'
import { store, react } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'
import { oracleOptions } from '../constants'
import { Logger } from '@mcro/logger'
import { join } from 'path'
import { getGlobalConfig } from '@mcro/config'

const log = new Logger('AppsManager')

type FakeProcess = {
  id: number
  oracle: Oracle
}

// @ts-ignore
@store
export class AppsManager {
  processes: FakeProcess[] = []
  mainOracle: Oracle

  constructor(oracle: Oracle) {
    this.mainOracle = oracle
  }

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
      for (const { id } of apps) {
        // if peek app, avoid (could be used for more control of orbit)
        // if (torn === false) {
        //   continue
        // }
        const shouldAdd = !this.processes.find(x => x.id === id)
        if (shouldAdd) {
          const icon = join(getGlobalConfig().paths.desktopRoot, 'assets', 'icon.png')
          log.info(`create process -- ${id} with icon ${icon}`)
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
      env: {
        SHOW_ICON: iconPath,
        VIRTUAL_APP: true,
      },
    })
    await oracle.start()
    log.verbose('spawnOracle', id, name)
    oracle.onAppState(this.handleAppState(id))
    return oracle
  }

  // set focus state from fake window
  handleAppState = id => (action: string) => {
    let nextState
    switch (action) {
      case 'focus':
        nextState = {
          focused: Date.now(),
        }
        break
      case 'blur':
        // since we switch the focus off the app immediately, avoid blur when it happens fast
        const curState = Desktop.state.appFocusState[id]
        if (
          curState &&
          typeof curState.focused === 'number' &&
          Date.now() - curState.focused < 80
        ) {
          console.log('avoid quick blur')
          return
        }
        nextState = {
          focused: false,
        }
        break
      case 'exit':
        nextState = {
          exited: true,
        }
        break
    }
    Desktop.setState({
      appFocusState: {
        [id]: nextState,
      },
    })
  }

  async removeProcess(id: number) {
    const index = this.processes.findIndex(x => x.id === id)
    await this.processes[index].oracle.stop()
    this.processes.splice(index, 1)
    log.verbose('removeProcess', id)
  }
}
