import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Pane from '~/apps/pane'
import Calendar from './feed/calendar'

const Card = ({ title, children, ...rest }) => (
  <UI.Surface background flex padding={20} borderRadius={5} {...rest}>
    <UI.Title
      if={title}
      paddingBottom={5}
      fontWeight={800}
      textOpacity={1}
      size={2}
    >
      {title}
    </UI.Title>
    {children}
  </UI.Surface>
)

@view({
  store: class HomeStore {},
})
export default class BarHomePane {
  render({ store }) {
    const start = 78

    const subCard = {
      position: 'absolute',
      top: `${start}%`,
      left: 10,
      right: 10,
      minHeight: 600,
      boxShadow: [[0, 0, 6, [0, 0, 0, 0.3]]],
    }

    return (
      <Pane.Card>
        <Card title="Home">
          <UI.Title padding={[10, 0]} size={1.5}>
            My Team
          </UI.Title>
          <cal css={{ height: 200, position: 'relative', margin: [20, 0, 0] }}>
            <Calendar />
          </cal>

          <br />
          <br />

          <UI.Title padding={[10, 0]} size={1.5}>
            My Stuff
          </UI.Title>

          <Card
            theme="light"
            title="What"
            css={{ ...subCard, transform: { scale: 0.95 } }}
          >
            123
          </Card>
          <Card
            theme="light"
            title="Other one"
            css={{
              ...subCard,
              top: `${start + 5}%`,
              transform: { scale: 0.975 },
            }}
          >
            123
          </Card>
          <Card
            theme="light"
            title="Other one"
            css={{ ...subCard, top: `${start + 10}%` }}
          >
            123
          </Card>
        </Card>
      </Pane.Card>
    )
  }

  static style = {
    home: {
      padding: 20,
    },
  }
}
