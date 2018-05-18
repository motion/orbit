import { view } from '@mcro/black'
import { SubTitle } from '~/views'
import * as UI from '@mcro/ui'

@UI.injectTheme
@view
export class Join {
  render({ theme, ...props }) {
    return (
      <section {...props}>
        <SubTitle size={1.8}>Get early access with your email</SubTitle>
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
    return {
      input: {
        color: theme.base.color,
        background: theme.base.background.lighten(0.2),
        border: [1, theme.base.background.lighten(0.5)],
      },
    }
  }
}
