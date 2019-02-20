import { save } from '@mcro/bridge'
import { GithubSource, GmailSource, SlackSource, SourceModel } from '@mcro/models'
import { react } from '@mcro/use-store'
import produce from 'immer'
import { memoize } from 'lodash'

type SourceWithWhiteList = GithubSource | SlackSource | GmailSource

export class WhitelistManager<T extends SourceWithWhiteList> {
  props: { source: T; getAll: () => string[] }
  values: T['values'] = { ...this.props.source.values }

  get isWhitelisting() {
    return !this.values.whitelist
  }

  saveSettingOnValuesUpdate = react(
    () => this.values,
    values => {
      save(SourceModel, {
        ...this.props.source,
        values,
      })
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
        values.whitelist = this.props.getAll()
      }
    })
  }

  whilistStatusGetter = memoize((id: string) => () => {
    if (!this.values.whitelist) {
      return true
    }
    if (Array.isArray(this.values.whitelist)) {
      return this.values.whitelist.includes(id)
    }
    return this.values.whitelist[id]
  })

  updateWhitelistValueSetter = memoize((id: string) => () => {
    this.updateValues(values => {
      if (!values.whitelist) {
        values.whitelist = this.props.getAll()
      }
      const index = values.whitelist.indexOf(id)
      if (index === -1) {
        values.whitelist.push(id)
      } else {
        values.whitelist.splice(index, 1)
      }
    })
  })
}
