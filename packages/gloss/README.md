TODO

- don't memo the whole gloss view, instead:
  - memo the work inside the view
  - why? lots of views take children, so memo does nothing
  - plus we can eventually memo things really smart, handling the various object syntax like boxShadow={{  }}



# gloss 💅

usage:

full-featured example:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import Icon from './icon'
import Popover from './popover'

const LINE_HEIGHT = 30

ReactDOM.render(
  <ThemeProvide bright={{ background: '#000' }}>
    <Theme name="bright">
      <Surface icon="name" />
    </Theme>
  </ThemeProvide>,
  document.querySelector('#app'),
)
```
