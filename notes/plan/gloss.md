```ts
// Shorthand ideas
const Button = view({
  background: 'black',
})

// setting this adds theme into props! :)
Button.theme = ({ theme, ...props }) => ({
  background: props.background || theme.background,
})

// so you can design your own little JSX-Style now :) with themes!

Button.theme = ({ theme, ...props }) => ({
  fontSize: props.size * 10,
})

// this will look at Button.styles and Button.theme
// and then just merge styles and run theme within its theme
const SmallButton = view(Button, {
  fontSize: 11,
})
```

```ts
// this looks doable

// better:
// no more weird $props
// no more magical static style or static theme
// full type checking
// still keeps most styles below

// still bad:
// still no checking for unused styles

// worse:
// theme is forced above return

// alternative:
// just use above syntax

import { view, css, attachTheme } from 'black'

@attachTheme
@view
class ComplexButton {
  render({ theme, ...props }) {
    this.$.theme({
      button: {
        background: props.background || theme.background,
      },
    })
    return (
      <div>
        <button
          className={css(props.className, this.$.button, {
            background: 'blue',
          })}
        />
      </div>
    )
  }

  $ = css.style({
    button: {
      background: 'green',
    },
  })
}
```
