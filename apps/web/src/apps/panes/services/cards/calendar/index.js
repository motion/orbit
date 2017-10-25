import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import App, { Thing, CurrentUser } from '~/app'
import Things from '../../views/things'
import * as Collapse from '../../views/collapse'

@view
class Calendar {
  render({ cal, isActive }) {
    return (
      <container $$row>
        <left $$row>
          <UI.Field
            row
            size={1.2}
            type="toggle"
            defaultValue={isActive}
            onChange={val => {
              const Setting = CurrentUser.setting.google
              Setting.mergeUpdate({
                values: {
                  calendarsActive: {
                    [cal.id]: val,
                  },
                },
              })
            }}
          />
          <repo>
            <name $$row css={{ alignItems: 'center' }}>
              <block
                css={{ marginRight: 10, background: cal.backgroundColor }}
              />
              <UI.Title
                size={1.2}
                fontWeight={300}
                color="#000"
                marginBottom={1}
              >
                {cal.summary}
              </UI.Title>
            </name>
            <info $$row>
              <left $$row if={false}>
                <UI.Text size={0.9}>last commit</UI.Text>
                <UI.Date size={0.9} $updatedAt>
                  {repo.pushedAt}
                </UI.Date>
              </left>
              <private
                css={{ marginLeft: 10, alignItems: 'center' }}
                if={false}
                $$row
              >
                <UI.Icon name="lock" size={12} />
                <UI.Text size={0.9} css={{ marginLeft: 5 }} fontWeight={500}>
                  private
                </UI.Text>
              </private>
            </info>
          </repo>
        </left>

        <syncers>
          <content $$row if={false}>
            <UI.Text>{repo.openIssuesCount} open issues</UI.Text>
          </content>
        </syncers>
      </container>
    )
  }

  static style = {
    container: {
      marginTop: 8,
      justifyContent: 'space-between',
    },
    block: {
      height: 20,
      width: 20,
      borderRadius: 5,
    },
    repo: {
      minWidth: 250,
      marginLeft: 15,
    },
    sync: {
      marginLeft: 20,
      flexFlow: 'row',
      background: [0, 0, 0, 0.01],
      border: '1px solid rgba(0,0,0,.08)',
      padding: [0, 10],
      borderRadius: 3,
    },
    syncTitle: {
      marginRight: 10,
    },
    updatedAt: {
      marginLeft: 5,
    },
  }
}

@view({
  store: class CalendarsStore {
    open = this.props.openDefault
  },
})
class Calendars {
  render({ title, store, items }) {
    const Setting = CurrentUser.setting.google
    const { calendarsActive = {} } = Setting.values

    return (
      <calendars>
        <title $$row onClick={() => (store.open = !store.open)}>
          <Collapse.Arrow open={store.open} />
          <UI.Title size={1.2} fontWeight={600}>
            {title} ({items.length})
          </UI.Title>
        </title>
        <Collapse.Body open={store.open}>
          <content>
            {items.map(cal => (
              <Calendar isActive={calendarsActive[cal.id]} cal={cal} />
            ))}
          </content>
        </Collapse.Body>
      </calendars>
    )
  }

  static style = {
    calendars: {
      marginTop: 10,
    },
    title: {
      userSelect: 'none',
    },
    content: {
      margin: [5, 15],
    },
  }
}

@view({
  store: class CalSettingsStore {
    events = Event.find({ type: 'calendar' })

    active = 'calendars'
  },
})
export default class CalSettings {
  componentDidMount() {
    setTimeout(() => {
      App.sync.google.cal.setupSettings()
    }, 100)
  }

  render({ store }) {
    const Setting = CurrentUser.setting.google
    if (!Setting) {
      return <null>No google setting</null>
    }
    const { calendars } = Setting.values
    const active = { background: 'rgba(0,0,0,0.15)' }

    return (
      <content>
        <UI.Row css={{ margin: [10, 0] }}>
          <UI.Button
            onClick={() => (store.active = 'calendars')}
            color={[0, 0, 0, 0.8]}
            {...(store.active === 'calendars' ? active : {})}
          >
            Active Calendars
          </UI.Button>
          <UI.Button
            {...(store.active === 'events' ? active : {})}
            onClick={() => (store.active = 'events')}
            color={[0, 0, 0, 0.8]}
          >
            Events ({(store.events || []).length})
          </UI.Button>
        </UI.Row>
        <UI.Form $noSelect if={calendars && store.active === 'calendars'}>
          <Calendars
            title="Yours"
            openDefault
            items={calendars.filter(cal => cal.accessRole === 'owner')}
          />
          <Calendars
            title="Others"
            items={calendars.filter(cal => cal.accessRole !== 'owner')}
          />
        </UI.Form>
        <Things if={store.active === 'events'} things={store.events || []} />
      </content>
    )
  }

  static style = {
    content: {
      flex: 1,
      overflowY: 'scroll',
      margin: [0, -20],
      padding: [0, 20],
    },
    noSelect: {
      userSelect: 'none',
    },
    field: {
      padding: [5, 0],
    },
  }
}
