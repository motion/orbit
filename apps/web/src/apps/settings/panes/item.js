import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { CurrentUser, Job } from '~/app'
import { OS } from '~/helpers'
import * as Collapse from './views/collapse'
import Logo from './views/logo'
import { formatDistance } from 'date-fns'
import { includes } from 'lodash'
import SyncStatus from './views/syncStatus'
import r2 from '@mcro/r2'
import * as Constants from '~/constants'

class ItemStore {
  open = false
  typeToJob = {
    drive: { action: 'drive', service: 'google' },
    slack: { action: 'gather', service: 'slack' },
    calendar: { action: 'cal', service: 'google' },
    github: { action: 'task', service: 'github' },
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
    if (!this.props.settingsStore.lastJobs) {
      return null
    }
    return this.props.settingsStore.lastJobs[service + ':' + action]
  }

  checkAuths = async () => {
    const { error, ...authorizations } = await r2.get(
      `${Constants.API_URL}/getCreds`
    ).json
    if (error) {
      console.log('no creds')
    } else {
      return authorizations
    }
  }

  startOauth(integration) {
    if (Constants.IS_ELECTRON) {
      OS.send('open-settings', integration)
    } else {
      window.open(`${Constants.API_URL}/authorize?service=${integration}`)
    }
    const checker = this.setInterval(async () => {
      const authorizations = await this.checkAuths()
      if (authorizations) {
        console.log('update auths', authorizations)
        await CurrentUser.setAuthorizations(authorizations)
        clearInterval(checker)
      }
    }, 1000)
  }
}

@view({
  store: ItemStore,
})
export default class Item {
  render({ store, settingsStore, type }) {
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
                {formatDistance(new Date(store.lastJob.createdAt), Date.now())}{' '}
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
            <SyncStatus settingsStore={settingsStore} service={type} />
          </sub>
        </header>
      </service>
    )
  }

  static style = {
    service: {
      marginTop: 30,
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
