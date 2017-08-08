import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class PaneCard {
  render({ id, title, icon, children, chromeless }) {
    return (
      <card $chromeless={chromeless}>
        <UI.Theme name="light">
          <task>
            <heading>
              <headingcontent>
                <UI.Title display="block" size={1.5}>
                  <span if={id}>#{id}</span> {title}
                </UI.Title>
                <UI.Icon
                  css={{ marginTop: 10, marginLeft: 20 }}
                  color="#555"
                  size={30}
                  name={icon}
                />
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
    chromeless: {
      background: 'transparent',
      boxShadow: 'none',
    },
    heading: {
      borderBottom: [1, [0, 0, 0, 0.05]],
      paddingBottom: 5,
      marginBottom: 5,
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
    span: {
      padding: [2, 4],
      margin: [-2, -2],
      borderRadius: 5,
      background: [255, 255, 255, 0.1],
      fontSize: 16,
    },
  }
}
