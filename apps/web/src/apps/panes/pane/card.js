import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Actions from './actions'

@view.attach('paneStore')
@view
export default class PaneCard {
  render({
    id,
    paneStore,
    light,
    width,
    title,
    actions,
    icon,
    children,
    chromeless,
  }) {
    if (!paneStore) {
      return <h5>no store</h5>
    }
    // version is just to subscribe to updates
    const { selectedIds, toolbarActions } = paneStore

    return (
      <card $light={light} style={{ width }} $chromeless={chromeless}>
        <heading>
          <headingcontent if={title}>
            <UI.Title $title display="block" size={1.2}>
              {title}
            </UI.Title>
            <service>
              <UI.Icon $icon color="#555" size={24} name={icon} />
              <id if={id}>
                #{id.slice(0, 4)}
              </id>
            </service>
          </headingcontent>
          <Action
            actions={actions}
            color="#333"
            id="paneActions"
            if={actions}
          />
        </heading>
        <content>
          {children}
        </content>
        <toolbar if={toolbarActions} $$row>
          <info>
            {selectedIds.length} selected
            </info>
          <Actions
            actions={toolbarActions}
            id="toolbarActions"
            color="#eee"
          />
        </toolbar>
      </card>
    )
  }

  static style = {
    card: {
      flex: 1,
      position: 'relative',
      overflowY: 'scroll',
    },
    light: {
      background: '#eee',
    },
    content: {
      overflow: 'scroll',
      height: '100%',
    },
    toolbar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      padding: [3, 20],
      background: '#333',
      color: '#eee',
      fontSize: 14,
    },
    title: {
      alignSelf: 'center',
    },
    chromeless: {
      background: 'transparent',
      boxShadow: 'none',
    },
    headingcontent: {
      flex: 1,
      flexFlow: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      width: '100%',
    },
    service: {
      alignSelf: 'center',
      alignItems: 'center',
    },
    icon: {
      marginLeft: 6,
    },
    id: {
      alignText: 'center',
      alignSelf: 'center',
      marginTop: 3,
      fontWeight: 600,
      opacity: 0.9,
      fontSize: 13,
    },
  }
}
