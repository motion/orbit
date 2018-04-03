import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { formatDistance } from 'date-fns'
import { uniq, min, capitalize } from 'lodash'

@view
export default class SyncStatus {
  renderCalendar() {
    const { settingsStore } = this.props
    const events = (settingsStore.events || []).filter(
      ({ integration, type }) => {
        return integration === 'google' && type === 'calendar'
      }
    )
    const personCount = uniq(events.map(i => i.author)).length
    const minVal = min(events, e => +new Date(e.data.created))
    const firstDate = minVal && minVal.data.created
    return (
      <UI.Text size={1} opacity={0.6}>
        syncing <b>{events.length} events</b> with <b>{personCount} people</b>{' '}
        across <b>{formatDistance(new Date(firstDate), Date.now())}</b>
      </UI.Text>
    )
  }

  renderGithub() {
    const { settingsStore } = this.props
    const issues = (settingsStore.things || []).filter(
      ({ integration, type }) => {
        return integration === 'github' && type === 'task'
      }
    )
    const repoCount = uniq(issues.map(i => i.orgName + ':' + i.parentId)).length
    return (
      <UI.Text size={1} opacity={0.6}>
        syncing <b>{issues.length} issues</b> across <b>{repoCount} repos</b>
      </UI.Text>
    )
  }

  render({ service, settingsStore }) {
    console.log(settingsStore.things)
    return this[`render${capitalize(service)}`]()
  }
}
