import Calendar from '../feed/calendar'
import * as UI from '@mcro/ui'

export default class PersonSidebar {
  results = [
    {
      title: 'Name McNamey',
      subtitle: 'name@mcnamey.com',
      icon: (
        <img
          css={{
            width: 36,
            height: 36,
            borderRadius: 100,
            border: [2, [255, 255, 255, 0.2]],
          }}
          src="/images/me.jpg"
        />
      ),
      props: {
        highlight: false,
        primaryProps: {
          size: 1.2,
          fontWeight: 600,
        },
        css: {
          paddingTop: 12,
          paddingBottom: 12,
          borderBottom: [1, 'dotted', [255, 255, 255, 0.1]],
        },
      },
    },

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
