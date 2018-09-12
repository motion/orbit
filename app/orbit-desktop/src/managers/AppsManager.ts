import { Oracle } from '@mcro/oracle'
import { store, react } from '@mcro/black'
import { App, Desktop, Electron } from '@mcro/stores'
import { stringify } from '@mcro/helpers'
import { oracleOptions } from '../constants'

type FakeProcess = {
  id: number
  oracle: Oracle
}

// @ts-ignore
@store
export class AppsManager {
  processes: FakeProcess[] = []

  manageAppIcons = react(
    () => App.appsState,
    async appsState => {
      console.log('appsManager sees apps', stringify(appsState))

      // launch app icons and events to listen for focus

      // handle deletes
      let current = [...this.processes]
      for (const { id } of current) {
        const hasApp = appsState.find(x => x.id === id)
        const shouldDelete = !hasApp
        if (shouldDelete) {
          await this.removeProcess(id)
        }
      }

      // handle adds
      for (const { id, torn } of appsState) {
        // dont handle peek app
        if (!torn) {
          continue
        }
        const shouldAdd = !this.processes.find(x => x.id === id)
        if (shouldAdd) {
          const oracle = await this.spawnOracle(
            id,
            'Test',
            '/Users/nw/projects/motion/orbit/assets/icon.png',
          )
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
    console.log('started oracle', id, name)
    oracle.onAppState(this.handleAppState(id))
    return oracle
  }

  handleAppState = id => (action: string) => {
    Desktop.sendMessage(
      Electron,
      Electron.messages.APP_STATE,
      JSON.stringify({ id, action }),
    )
  }

  async removeProcess(id: number) {
    const index = this.processes.findIndex(x => x.id === id)
    await this.processes[index].oracle.stop()
    this.processes.splice(index, 1)
  }
}
