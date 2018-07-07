```ts
// Shorthand ideas
const Button = view(
  {
    background: 'black',
  },
  (props, theme) => ({
    background: props.background || theme.background,
  }),
)

// this will look at Button.styles and Button.theme
// and then just merge styles and run theme within its theme
const SmallButton = view(Button, {
  fontSize: 11,
})
```

```ts
import { view } from 'black'

// instantiate it
const $ = style()

// move to css prop only means no type errors
@view
class ComplexButton {
  render() {
    return (
      <div>
        <button
          css={{
            ...$.red,
            background: 'blue',
          }}
        />
      </div>
    )
  }
}

$.red = {
  background: 'red',
}

$.blue = {}

$((props, theme) => ({
  red: {
    background: theme.background,
  },
}))
```
