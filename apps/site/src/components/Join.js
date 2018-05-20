import { view } from '@mcro/black'
import { SubTitle, P, P2 } from '~/views'
import * as UI from '@mcro/ui'

@UI.injectTheme
@view
export class Join {
  render({ theme, ...props }) {
    return (
      <section id="join" {...props}>
        <P size={1.8} css={{ marginRight: 30 }}>
          Get early access
        </P>
        <P2 alpha={0.7} size={1.2} margin={[5, 0, 10]}>
          We'll send one or two updates as we develop Orbit with progress.
        </P2>
        <form
          action="https://tryorbit.us18.list-manage.com/subscribe/post?u=019909d3efb283014d35674e5&amp;id=015e5a3442"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          class="validate"
          target="_blank"
          novalidate
        >
          <input
            type="email"
            name="EMAIL"
            class="required email"
            id="mce-EMAIL"
          />
          <div $$hidden aria-hidden="true">
            <input
              type="text"
              name="b_019909d3efb283014d35674e5_015e5a3442"
              tabindex="-1"
              value=""
            />
          </div>
          <UI.Button
            size={1.1}
            theme="rgb(3.5%, 44.5%, 23.6%)"
            sizeRadius={3}
            margin={[0, 0, 0, 'auto']}
            type="submit"
          >
            Join early access
          </UI.Button>
        </form>
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
        WebkitTextFillColor: `${theme.base.color} !important`,
        background: bg[adjust](0.3 * amt),
        border: [1, bg[adjust](1.2 * amt)],
      },
    }
  }
}
