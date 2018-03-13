import { store } from '@mcro/black/store'
import { App, Desktop } from '@mcro/all'

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
        this.search(query, newResults => {
          if (uid === this.searchId) {
            results = [...results, ...newResults]
            Desktop.setState({ pluginResults: results.slice(0, 100) })
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
