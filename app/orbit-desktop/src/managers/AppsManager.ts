import { Oracle } from '@mcro/oracle'
import { store, react } from '@mcro/black'
import { App } from '@mcro/stores'
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
      for (const [index, { id }] of current.entries()) {
        const shouldDelete = !appsState.find(x => x.id === id)
        if (!shouldDelete) {
          await this.removeProcess(index)
        }
      }

      // handle adds
      for (const { id } of appsState) {
        const shouldAdd = !this.processes.find(x => x.id === id)
        if (shouldAdd) {
          const oracle = await this.spawnOracle(
            '/Users/nw/projects/motion/oracle/assets/orbit-logo.png',
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

  async spawnOracle(iconPath: string) {
    const oracle = new Oracle({
      ...oracleOptions,
      env: { SHOW_ICON: iconPath },
    })
    await oracle.start()
    return oracle
  }

  async removeProcess(index: number) {
    await this.processes[index].oracle.stop()
    this.processes.splice(index, 1)
  }
}
