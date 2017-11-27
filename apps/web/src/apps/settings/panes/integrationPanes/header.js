import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { CurrentUser, Job } from '~/app'
import { OS } from '~/helpers'
import Logo from './views/logo'
import { formatDistance } from 'date-fns'
import { includes } from 'lodash'
import r2 from '@mcro/r2'
import * as Constants from '~/constants'

class IntegrationHeaderStore {
  typeToJob = {
    drive: { action: 'drive', service: 'google' },
    slack: { action: 'attachments', service: 'slack' },
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

  unlink = () => {
    CurrentUser.unlink(this.authName)
  }

  get lastJob() {
    const { type } = this.props
    const { action, service } = this.typeToJob[type]
    if (!this.props.integrationStore.lastJobs) {
      return null
    }
    return this.props.integrationStore.lastJobs[service + ':' + action]
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
      OS.send('open-auth', integration)
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

@view.attach('integrationStore')
@view({
  store: IntegrationHeaderStore,
})
export default class ServiceHeader {
  render({ store, type }) {
    return (
      <header>
        <left>
          <Logo service={type} />
        </left>
        <right if={store.auth}>
          <UI.Text
            if={store.lastJob && store.lastJob.status === 2}
            size={0.9}
            opacity={0.7}
            css={{ marginLeft: 10 }}
          >
            synced{' '}
            {formatDistance(new Date(store.lastJob.createdAt), Date.now())} ago
          </UI.Text>
          <UI.Text
            if={store.lastJob && store.lastJob.status < 2}
            size={0.9}
            opacity={0.7}
            css={{ marginLeft: 10 }}
          >
            Syncing now
          </UI.Text>
          <UI.Button
            icon="refresh2"
            onClick={store.runJob}
            size={1}
            css={{ marginLeft: 10 }}
          >
            Sync
          </UI.Button>
          <UI.Button
            icon="lock-c-open"
            onClick={store.unlink}
            size={1}
            css={{ marginLeft: 10 }}
          >
            Unlink
          </UI.Button>
        </right>
        <right if={!store.auth}>
          <UI.Button
            onClick={() => store.startOauth(store.authName)}
            size={1}
            css={{ marginBottom: 2 }}
          >
            Authorize
          </UI.Button>
        </right>
      </header>
    )
  }

  static style = {
    header: {
      padding: [10, 0],
      flexFlow: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(0,0,0,0.1)',
      marginBottom: 5,
      userSelect: 'none',
    },
    left: {
      alignItems: 'center',
      flex: 1,
      flexFlow: 'row',
    },
    right: {
      flexFlow: 'row',
      alignItems: 'center',
    },
  }
}
