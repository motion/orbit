Plugins for Orbit

How you'd turn everything we have now into a platform.

Structure:

```
index.ts
/views
  Card.tsx
  App.tsx
```

index.ts

```ts
import { Card } from './views'
import { App } from './views'

const initialize = async ({ setting, user }) => {
  return {
    card: props => <Card {...props} setting={setting} />,
    app: props => <App {...props} setting={setting} />,
  }
}

export default {
  title: '',
  icon: '',
  client: {
    onSearch: query => {

    }
  },
  server: {
    onSearch: query => {

    }
  }
  initialize,
}
```
