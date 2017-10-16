import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { CurrentUser, Job } from '~/app'
import * as Cards from './cards'
import { OS } from '~/helpers'
import * as Collapse from './views/collapse'
import Logo from './logo'
import { formatDistance } from 'date-fns'
import { includes } from 'lodash'
import SyncStatus from './syncStatus'
import r2 from '@mcro/r2'
import * as Constants from '~/constants'

@view
class NotFound {
  render({ type }) {
    return <UI.Title size={1.2}>card {type} not found</UI.Title>
  }
}

class ItemStore {
  open = false
  typeToJob = {
    drive: { action: 'drive', service: 'google' },
    slack: { action: 'gather', service: 'slack' },
    calendar: { action: 'cal', service: 'google' },
    github: { action: 'issues', service: 'github' },
  }

  runJob = () => {
    const { type } = this.props
    const { action, service } = this.typeToJob[type]
    console.log('running', { type: service, action })
    Job.create({ type: service, action })
  }

  get authName() {
    const { type } = this.props
    return includes(['drive', 'calendar'], type) ? 'google' : type
  }

  get auth() {
    return (
      CurrentUser.authorizations && CurrentUser.authorizations[this.authName]
    )
  }

  get lastJob() {
    const { type } = this.props
    const { action, service } = this.typeToJob[type]

    const job = this.props.serviceStore.lastJobs[service + ':' + action]
    return job
  }

  checkAuths = async () => {
    const { error, ...authorizations } = await r2.get(
      `${Constants.API_URL}/getCreds`
    ).json
    if (error) {
      console.log('no creds')
    } else {
      await CurrentUser.setAuthorizations(authorizations)
      return authorizations
    }
  }

  startOauth(integration) {
    OS.send('open-settings', integration)
    const checker = this.setInterval(async () => {
      const done = await this.checkAuths()
      if (done) {
        console.log('update auths', done)
        clearInterval(checker)
      }
    }, 1000)
  }
}

@view({
  store: ItemStore,
})
export default class Item {
  render({ store, serviceStore, type }) {
    const Card = Cards[type] || NotFound
    return (
      <service key={type}>
        <header>
          <top $$row>
            <left $$row css={{ flex: 1 }}>
              <toggle $$row onClick={() => (store.open = !store.open)}>
                <Collapse.Arrow if={store.auth} open={store.open} />
                <logo>
                  <Logo service={type} />
                </logo>
              </toggle>
            </left>
            <right if={store.auth} $$row css={{ alignItems: 'center' }}>
              <UI.Text
                if={store.lastJob && store.lastJob.status === 2}
                size={0.9}
                opacity={0.7}
                css={{ marginLeft: 10 }}
              >
                synced{' '}
                {formatDistance(
                  new Date(store.lastJob.createdAt),
                  Date.now()
                )}{' '}
                ago
              </UI.Text>
              <UI.Text
                if={store.lastJob && store.lastJob.status < 2}
                size={0.9}
                opacity={0.7}
                css={{ marginLeft: 10 }}
              >
                syncing now
              </UI.Text>

              <UI.Button
                icon="refresh2"
                onClick={store.runJob}
                size={0.8}
                css={{ marginLeft: 10 }}
              />
            </right>
            <right if={!store.auth} $$row css={{ alignItems: 'center' }}>
              <UI.Button
                onClick={() => store.startOauth(store.authName)}
                size={0.9}
                css={{ marginBottom: 2 }}
              >
                authorize
              </UI.Button>
            </right>
          </top>
          <sub if={store.auth}>
            <SyncStatus store={serviceStore} service={type} />
          </sub>
        </header>
        <Collapse.Body open={store.open && store.auth}>
          <card>
            <Card if={store.open && store.auth} store={store} />
          </card>
        </Collapse.Body>
      </service>
    )
  }

  static style = {
    service: {
      marginTop: 30,
    },
    card: {
      margin: [5, 15],
    },
    left: {
      alignItems: 'center',
    },
    logo: {
      userSelect: 'none',
    },
    toggle: {
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
