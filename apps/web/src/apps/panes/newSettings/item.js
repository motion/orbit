import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { Job } from '~/app'
import * as Cards from './cards'
import { includes, invert, capitalize } from 'lodash'

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
            />
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
export default class Item {
  render({ store, type }) {
    const { countByType } = store
    const Card = Cards[type]

    return (
      <service key={type} css={{ flex: 1 }}>
        <typeHeader $$row css={{ justifyContent: 'space-between' }}>
          <left $$row css={{ alignItems: 'center' }}>
            <UI.Icon size={18} css={{ marginRight: 7 }} name={type} />
            <UI.Title size={1.4}>{capitalize(type)}</UI.Title>
            <UI.Title
              opacity={0.6}
              css={{ marginLeft: 10 }}
              fontWeight={200}
              size={1.2}
            >
              {countByType[type] || 0} items
            </UI.Title>
          </left>
          <UI.Button chromeless onClick={() => store.clearType(type)}>
            clear all
          </UI.Button>
        </typeHeader>
        <Card />
        <actions>
          {store
            .actions(type)
            .map(action => (
              <Action store={store} type={type} action={action} />
            ))}
        </actions>
      </service>
    )
  }

  static style = {
    actions: {
      margin: 10,
    },
  }
}
