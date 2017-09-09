import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class PaneCard {
  render({ id, title, icon, children, chromeless, ...props }) {
    return (
      <card $chromeless={chromeless} {...props}>
        <UI.Theme name="light">
          <task>
            <heading>
              <headingcontent>
                <UI.Title $title display="block" size={1.2}>
                  {title}
                </UI.Title>
                <service>
                  <UI.Icon $icon color="#555" size={24} name={icon} />
                  <id if={id}>#{id.slice(0, 4)}</id>
                </service>
              </headingcontent>
            </heading>

            {children}
          </task>
        </UI.Theme>
      </card>
    )
  }

  static style = {
    card: {
      flex: 1,
      padding: 8,
      background: [250, 250, 250, 1],
      boxShadow: [[0, 0, 0, 2, [0, 0, 0, 0.1]]],
    },
    task: {
      flex: 1,
    },
    title: {
      alignSelf: 'center',
    },
    chromeless: {
      background: 'transparent',
      boxShadow: 'none',
    },
    heading: {
      borderBottom: [1, [0, 0, 0, 0.05]],
      paddingBottom: 5,
      padding: [0, 10],
      width: '100%',
      overflow: 'hidden',
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
