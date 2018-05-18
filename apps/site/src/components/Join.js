import { view } from '@mcro/black'
import { SubTitle } from '~/views'
import * as UI from '@mcro/ui'

@UI.injectTheme
@view
export class Join {
  render({ theme, ...props }) {
    return (
      <section {...props}>
        <SubTitle size={1.8} css={{ marginRight: 30 }}>
          Get early access with your email
        </SubTitle>
        <input placeholder="Email address..." />
        <UI.Button
          size={1.1}
          theme="rgb(3.5%, 44.5%, 23.6%)"
          sizeRadius={3}
          margin={[0, 0, 0, 'auto']}
        >
          Join Early Waitlist
        </UI.Button>
      </section>
    )
  }

  static style = {
    section: {
      textAlign: 'left',
      minWidth: 300,
      width: '100%',
      maxWidth: 400,
      margin: [0, 'auto'],
      padding: [5, 10],
    },
    input: {
      display: 'flex',
      width: '100%',
      flex: 1,
      padding: [12, 16],
      margin: [10, 0, 20],
      fontSize: 18,
      border: [1, 'red'],
    },
  }

  static theme = (props, theme) => {
    const bg = theme.base.background
    const isLight = bg.isLight()
    const adjust = isLight ? 'darken' : 'lighten'
    const amt = isLight ? 0.1 : 1
    return {
      input: {
        color: theme.base.color,
        background: bg[adjust](0.3 * amt),
        border: [1, bg[adjust](1.2 * amt)],
      },
    }
  }
}
