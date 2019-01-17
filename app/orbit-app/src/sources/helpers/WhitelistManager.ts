import { store, react } from '@mcro/black'
import { SourceModel, GithubSource, SlackSource, GmailSource } from '@mcro/models'
import { save } from '@mcro/model-bridge'
import produce from 'immer'
import { memoize } from 'lodash'

type SourceWithWhiteList = GithubSource | SlackSource | GmailSource

type Options<T> = {
  source: T
  getAll: () => string[]
}

@store
export class WhitelistManager<T extends SourceWithWhiteList> {
  source: T = null
  values: T['values'] = null
  getAll: Options<T>['getAll']

  constructor({ source, getAll }: Options<T>) {
    this.source = source
    this.getAll = getAll
    // copy it onto the store so we get instant mutations in views
    // then we react later and save it to the async model
    this.values = { ...source.values }
  }

  get isWhitelisting() {
    return !this.values.whitelist
  }

  saveSettingOnValuesUpdate = react(
    () => this.values,
    values => {
      this.source.values = values
      save(SourceModel, this.source)
    },
  )

  updateValues(cb) {
    this.values = produce(this.values, cb)
  }

  getValue(key: string) {
    return this.values[key]
  }

  toggleActive = () => {
    this.updateValues(values => {
      if (values.whitelist) {
        // toggle to "sync all"
        values.whitelist = undefined
      } else {
        // toggle away from sync all, set each repository
        values.whitelist = this.getAll()
      }
    })
  }

  whilistStatusGetter = memoize((id: string) => () => {
    if (!this.values.whitelist) {
      return true
    }
    return this.values.whitelist.indexOf(id) !== -1
  })

  updateWhitelistValueSetter = memoize((id: string) => () => {
    this.updateValues(values => {
      if (!values.whitelist) {
        values.whitelist = this.getAll()
      }
      const index = values.whitelist.indexOf(id)
      if (index === -1) {
        values.whitelist.push(id)
      } else {
        values.whitelist.splice(index, 1)
      }
    })
  })

  dispose() {
    // @ts-ignore
    this.subscriptions.dispose()
  }
}
