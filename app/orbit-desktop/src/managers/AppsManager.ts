import { Oracle } from '@mcro/oracle'
import { store, react } from '@mcro/black'
import { App } from '@mcro/stores'
import { stringify } from '@mcro/helpers'
import { oracleOptions } from '../constants'

type FakeProcess = {
  id: number
  oracle: Oracle
}

type Props = {
  onAction: (appId: number, value: string) => any
}

// @ts-ignore
@store
export class AppsManager {
  processes: FakeProcess[] = []
  props: Props

  constructor(props: Props) {
    this.props = props
  }

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
    this.props.onAction(id, action)
  }

  async removeProcess(index: number) {
    await this.processes[index].oracle.stop()
    this.processes.splice(index, 1)
  }
}
