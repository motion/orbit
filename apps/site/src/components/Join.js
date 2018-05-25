import * as React from 'react'
import { view } from '@mcro/black'
import { P, P2, Callout } from '~/views'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'

@view
export class Join extends React.Component {
  render({ ...props }) {
    return (
      <section id="join" {...props}>
        <Callout>
          <P size={2.2} fontWeight={600} css={{ marginRight: 30 }}>
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
            target="_blank"
            noValidate
          >
            <input type="email" name="EMAIL" id="mce-EMAIL" />
            <div $$hidden aria-hidden="true">
              <input
                type="text"
                name="b_019909d3efb283014d35674e5_015e5a3442"
                tabIndex="-1"
                value=""
              />
            </div>
            <UI.Theme theme={Constants.colorMain.toString()}>
              <UI.Button
                size={1.1}
                theme="rgb(3.5%, 44.5%, 23.6%)"
                sizeRadius={3}
                margin={[0, 0, 0, 'auto']}
                type="submit"
              >
                Join early access
              </UI.Button>
            </UI.Theme>
          </form>
        </Callout>
      </section>
    )
  }

  static style = {
    section: {
      textAlign: 'left',
      minWidth: 300,
      width: '100%',
      maxWidth: 450,
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
