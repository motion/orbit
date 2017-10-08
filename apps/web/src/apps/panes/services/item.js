import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import App, { Job } from '~/app'
import * as Cards from './cards'
import CollapseArrow from './collapseArrow'
import Logo from './logo'
import { formatDistance } from 'date-fns'
import { includes, uniq, min, invert, capitalize } from 'lodash'

@view
class Action {
  render({ type, action, store }) {
    const { lastSync } = store
    const job = lastSync(type, action) || null
    const running = job && includes([0, 1], job.status)
    const status = job && invert(Job.status)[job.status]

    return (
      <action $$row key={action}>
        <header>
          <left $$row css={{ alignItems: 'center' }}>
            <UI.Title size={1.2} css={{ marginRight: 8, fontWeight: 'bold' }}>
              {capitalize(action)}
            </UI.Title>
            <UI.Button
              if={!running}
              icon="refresh2"
              iconSize={13}
              size={0.8}
              onClick={() => store.runJob(type, action)}
            >
              sync all
            </UI.Button>
          </left>
          <lastSync $$row if={job} style={{ marginTop: 3, opacity: 0.5 }}>
            <UI.Text css={{ marginRight: 5 }}>refreshed </UI.Text>
            <UI.Date $when>{job.createdAt}</UI.Date>
          </lastSync>
        </header>

        <UI.Text if={running}>job {status}</UI.Text>
      </action>
    )
  }

  static style = {
    action: {
      marginTop: 10,
      justifyContent: 'space-between',
    },
  }
}

@view
class SyncStatus {
  renderDrive() {
    return (
      <UI.Text size={1} opacity={0.6}>
        syncing <b>3,320 files</b> across <b>130 folders</b>
      </UI.Text>
    )
  }

  // cal
  renderGoogle() {
    const { store } = this.props

    const events = (store.events || []).filter(({ integration, type }) => {
      return integration === 'google' && type === 'calendar'
    })

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
    const { store } = this.props

    const issues = (store.things || []).filter(({ integration, type }) => {
      return integration === 'github' && type === 'task'
    })

    const repoCount = uniq(issues.map(i => i.orgName + ':' + i.parentId)).length

    return (
      <UI.Text size={1} opacity={0.6}>
        syncing <b>{issues.length} issues</b> across <b>{repoCount} repos</b>
      </UI.Text>
    )
  }

  renderSlack() {
    return (
      <UI.Text size={1} opacity={0.6}>
        syncing <b>4,200 conversations</b> across <b>13 channels</b>
      </UI.Text>
    )
  }

  render({ service, store }) {
    store.things
    return this['render' + capitalize(service)]()
  }
}

@view
class NotFound {
  render({ type }) {
    return <UI.Title size={1.2}>card {type} not found</UI.Title>
  }
}

@view({
  store: class ItemStore {
    open = false

    typeToJob = {
      drive: { action: 'drive', service: 'google' },
      slack: { action: 'gather', service: 'slack' },
      google: { action: 'cal', service: 'google' },
      github: { action: 'issues', service: 'github' },
    }

    runJob = () => {
      const { type } = this.props
      const { action, service } = this.typeToJob[type]
      console.log('running', { type: service, action })

      Job.create({ type: service, action })
    }

    get auth() {
      return CurrentUser.authorizations[this.props.type]
    }

    get lastJob() {
      const { type } = this.props
      const { action, service } = this.typeToJob[type]

      const job = this.props.serviceStore.lastJobs[service + ':' + action]
      return job && new Date(job.createdAt)
    }
  },
})
export default class Item {
  render({ store, serviceStore, type }) {
    const Card = Cards[type] || NotFound

    return (
      <UI.Theme name="light">
        <service key={type} css={{ flex: 1 }}>
          <header>
            <top $$row>
              <left $$row css={{ width: 100 }}>
                <toggle $$row onClick={() => (store.open = !store.open)}>
                  <CollapseArrow if={store.auth} open={store.open} />
                  <logo>
                    <Logo service={type} />
                  </logo>
                </toggle>
              </left>
              <auth if={!store.auth} $$row>
                <UI.Button size={0.9} css={{ marginBottom: 2 }}>
                  authorize
                </UI.Button>
              </auth>
              <right if={store.auth} $$row css={{ alignItems: 'center' }}>
                <UI.Text
                  if={store.lastJob}
                  size={0.9}
                  opacity={0.7}
                  css={{ marginLeft: 10 }}
                >
                  synced {formatDistance(store.lastJob, Date.now())} ago
                </UI.Text>
                <UI.Button
                  icon="refresh2"
                  onClick={store.runJob}
                  size={0.8}
                  css={{ marginLeft: 10 }}
                />
              </right>
            </top>
            <sub if={store.auth}>
              <SyncStatus store={serviceStore} service={type} />
            </sub>
          </header>
          <contents if={store.open && store.auth}>
            <Card if={store.auth} store={store} />
          </contents>
          <actions if={false}>
            {store
              .actions(type)
              .map(action => (
                <Action store={store} type={type} action={action} />
              ))}
          </actions>
        </service>
      </UI.Theme>
    )
  }

  static style = {
    left: {
      alignItems: 'center',
    },
    logo: {
      userSelect: 'none',
    },
    top: {
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(0,0,0,0.1)',
      marginBottom: 5,
    },
    actions: {
      margin: 10,
    },
    contents: {
      padding: [5, 10],
    },
  }
}
