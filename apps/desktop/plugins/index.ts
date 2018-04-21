import { store, react } from '@mcro/black/store'
import { App, Desktop } from '@mcro/all'
import Icons from './icons'
import * as _ from 'lodash'
import * as MacAppsPlugin from './macApps'
import * as FilesPlugin from './files'
import * as CalculatorPlugin from './calculator'
import * as ConversionPlugin from './conversion'
import debug from '@mcro/debug'

type Plugin = {
  initialize?: Function
  fn?: Function
}

const plugins: Plugin[] = [
  MacAppsPlugin,
  FilesPlugin,
  CalculatorPlugin,
  ConversionPlugin,
]
const log = debug('Plugins')

@store
export default class Plugins {
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

  @react({ fireImmediately: true, log: false })
  results = [
    () => App.state.query,
    async (query, { sleep }) => {
      const results = await this.search(query)
      await sleep(0) // cancellation
      const pluginResults = await Promise.all(
        results.slice(0, 25).map(async result => ({
          ...result,
          // @ts-ignore
          icon: result.icon ? await this.icons.getIcon(result.icon) : null,
          type: 'app',
        })),
      )
      await sleep(0) // cancellation
      Desktop.setSearchState({ pluginResults })
      return pluginResults
    },
  ]

  search = async term => {
    return _.flatten(
      await Promise.all(
        this.plugins.map(
          plugin => new Promise(res => plugin.fn({ term, display: res })),
        ),
      ),
    )
  }
}
