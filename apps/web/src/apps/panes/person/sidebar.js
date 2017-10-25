import Calendar from '../feed/calendar'
import * as UI from '@mcro/ui'

export default class PersonSidebar {
  results = [
    {
      title: 'Actions',
      displayTitle: false,
      children: (
        <div css={{ flex: 1 }}>
          <UI.Row stretch>
            <UI.Button icon="mail">Email</UI.Button>
            <UI.Button icon="soc-slack">Slack</UI.Button>
          </UI.Row>
        </div>
      ),
    },

    {
      title: 'none',
      displayTitle: false,
      children: <Calendar labels={[]} />,
    },

    {
      title: 'Product Page',
      subtitle: 'Manager',
      category: 'Team',
    },

    {
      category: 'This week',
      icon: 'social-slack',
      title: 'Shared 10 links in 5 rooms',
      subtitle: '#general, #bizdev, #marketing',
      date: Date.now() - 1000000,
      props: { iconAfter: false },
    },
    {
      category: 'This week',
      icon: 'social-google',
      title: 'Edited 2 documents',
      subtitle: 'Planning meeting 21, Something else',
      date: Date.now() - 100000000,
      props: { iconAfter: false },
    },
    {
      category: 'This week',
      icon: 'social-github',
      title: 'Closed 3 pull requests',
      subtitle: 'motion/orbit, motion/slack',
      date: Date.now() - 1000000000,
      props: { iconAfter: false },
    },
  ]
}
