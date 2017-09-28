import { view } from '@mcro/black'
import Icon from './icon'
import Theme from './helpers/theme'
import Title from './title'

@view.ui
export default class Card {
  static defaultProps = {
    theme: 'light',
  }

  render({ id, title, icon, children, chromeless, theme, ...props }) {
    return (
      <card $chromeless={chromeless} {...props}>
        <Theme name={theme}>
          <task>
            <heading if={title}>
              <headingcontent>
                <Title $title display="block" size={1.2}>
                  {title}
                </Title>
                <service>
                  <Icon if={false} $icon color="#555" size={24} name={icon} />
                  <id if={id}>#{id.slice(0, 4)}</id>
                </service>
              </headingcontent>
            </heading>
            {children}
          </task>
        </Theme>
      </card>
    )
  }

  static style = {
    card: {
      flex: 1,
      padding: 8,
      background: [250, 250, 250, 1],
      boxShadow: [[0, 0, 0, 2, [0, 0, 0, 0.1]]],
      overflow: 'hidden',
      overflowY: 'scroll',
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
