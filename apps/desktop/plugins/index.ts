import { store, react } from '@mcro/black/store'
import { App, Desktop } from '@mcro/stores'
import Icons from './icons'
import * as _ from 'lodash'
import * as MacAppsPlugin from './macApps'
import * as FilesPlugin from './files'
import * as CalculatorPlugin from './calculator'
import * as ConversionPlugin from './conversion'
import * as RipGrep from './ripgrep'

type Plugin = {
  initialize?: Function
  fn?: Function
}

const plugins: Plugin[] = [
  MacAppsPlugin,
  FilesPlugin,
  CalculatorPlugin,
  ConversionPlugin,
  RipGrep,
]

@store
export class Plugins {
  plugins = plugins
  searchId = 0
  server: any
  icons: Icons

  constructor({ server }) {
    this.server = server
    this.icons = new Icons()
    this.start()
  }

  async start() {
    await this.initializePlugins()
  }

  async initializePlugins() {
    await Promise.all(
      this.plugins.map(plugin => plugin.initialize && plugin.initialize()),
    )
  }

  results = react(
    () => [App.state.query, Desktop.state.lastBitUpdatedAt],
    async ([query], { sleep }) => {
      await sleep(60) // debounce
      // console.time('searchPlugins')
      const results = await this.search(query)
      // console.timeEnd('searchPlugins')
      // console.time('searchPlugins2')
      const pluginResults = await Promise.all(
        results.slice(0, 5).map(async result => ({
          ...result,
          // @ts-ignore
          icon: result.icon ? await this.icons.getIcon(result.icon) : null,
          type: 'app',
        })),
      )
      // console.timeEnd('searchPlugins2')
      await sleep()
      Desktop.setSearchState({ pluginResults, pluginResultsId: query })
    },
    { immediate: true },
  )

  search = async term => {
    return _.flatten(
      await Promise.all(
        this.plugins.map(plugin => {
          // const timer = `plugin-${index}`
          // console.time(timer)
          return new Promise(res =>
            plugin.fn({
              term,
              display: answer => {
                // console.timeEnd(timer)
                res(answer)
              },
            }),
          )
        }),
      ),
    )
  }
}
