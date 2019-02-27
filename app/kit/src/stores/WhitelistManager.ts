import { save } from '@mcro/bridge'
import { isEqual } from '@mcro/fast-compare'
import { AppModel } from '@mcro/models'
import { ensure, react } from '@mcro/use-store'
import produce from 'immer'
import { memoize } from 'lodash'

export class WhitelistManager<T extends { data?: { values?: { whitelist?: string[] } } }> {
  props: { app: T; getAll: () => string[] }
  values: T['data']['values'] = {}

  syncValuesFromProp = react(
    () => this.props.app,
    app => {
      ensure('app', !!app)
      this.values = { ...this.props.app.data.values }
    },
  )

  get isWhitelisting() {
    return !this.values.whitelist
  }

  getIsWhitelisting() {
    return this.isWhitelisting
  }

  persistSetting = react(
    () => this.values,
    values => {
      const next = produce(this.props.app, draft => {
        draft.data.values = values
      })
      ensure('is updated', !isEqual(next, this.props.app))
      console.warn('updating app', next)
      save(AppModel, next)
    },
    {
      deferFirstRun: true,
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
