import { store, react } from '@mcro/black/store'
import { App, Desktop } from '@mcro/all'
import Icons from './icons'

// plugins
import * as MacAppsPlugin from './macApps'
import * as FilesPlugin from './files'

const plugins = [MacAppsPlugin, FilesPlugin]
const log = debug('Plugins')

@store
export default class Plugins {
  plugins = plugins
  results = []
  searchId = 0

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

  @react({ fireImmediately: true })
  reactToSearches = [
    () => App.state.query,
    async query => {
      console.log('react to query')
      const uid = Math.random()
      this.searchId = uid
      let results = []
      this.search(query, async newResults => {
        const resultsWithIcons = await Promise.all(
          newResults.slice(0, 25).map(async result => ({
            ...result,
            icon: result.icon ? await this.icons.getIcon(result.icon) : null,
          })),
        )
        const isStillValid = uid === this.searchId
        if (isStillValid) {
          results = [...results, ...resultsWithIcons]
          console.log(';SETTINGS THIS SHIT')
          Desktop.setSearchState({ pluginResults: results })
        }
      })
    },
  ]

  search = async (term, onResults) => {
    this.plugins.forEach(plugin => {
      plugin.fn({
        term,
        actions: this.actions,
        display: onResults,
      })
    })
  }
}
