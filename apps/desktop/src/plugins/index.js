import { store } from '@mcro/black/store'
import { App, Desktop } from '@mcro/all'
import getIcon from './getIcon'

// plugins
import * as MacAppsPlugin from './macApps'
import * as FilesPlugin from './files'

const plugins = [MacAppsPlugin, FilesPlugin]

@store
export default class Plugins {
  plugins = plugins
  results = []
  searchId = 0

  constructor() {
    this.start()
  }

  async start() {
    await this.initializePlugins()
    await this.reactToSearches()
  }

  async initializePlugins() {
    await Promise.all(
      this.plugins.map(plugin => plugin.initialize && plugin.initialize()),
    )
  }

  reactToSearches() {
    this.react(
      () => App.state.query,
      async query => {
        const uid = Math.random()
        this.searchId = uid
        let results = []
        this.search(query, async newResults => {
          const resultsWithIcons = await Promise.all(
            newResults.slice(0, 25).map(async result => ({
              ...result,
              icon: result.icon ? await getIcon(result.icon) : null,
            })),
          )
          if (uid === this.searchId) {
            results = [...results, ...resultsWithIcons]
            Desktop.setState({ pluginResults: results })
          }
        })
      },
    )
  }

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
