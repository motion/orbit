import * as MacAppsPlugin from './macApps'
import { flatten } from 'lodash'
import { store } from '@mcro/black/store'
import { App, Desktop } from '@mcro/all'

const plugins = [MacAppsPlugin]

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
    await Promise.all(this.plugins.map(plugin => plugin.initialize()))
  }

  reactToSearches() {
    this.react(
      () => App.state.query,
      async query => {
        const uid = (this.searchId = Math.random())
        const results = await this.search(query)
        if (uid === this.searchId) {
          Desktop.setState({ pluginResults: results })
        }
      },
    )
  }

  search = async term => {
    return flatten(
      await Promise.all(
        this.plugins.map(plugin => {
          return new Promise(res => {
            const display = results => res(results)
            plugin.fn({
              term,
              actions: this.actions,
              display,
            })
          })
        }),
      ),
    )
  }
}
