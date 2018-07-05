```ts
import { view } from 'black'

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

const style = style()

// move to css prop only means no type errors
@view
class ComplexButton {
  render() {
    return (
      <div>
        <button
          css={{
            ...style.red,
            background: 'blue',
          }}
        />
      </div>
    )
  }
}

style({
  red: {
    background: 'red',
  },
})
```
