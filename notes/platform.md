Platform

```
npm i -g orbit
orbit new
orbit test
orbit deploy
```

```
app.json
  name, icon, etc
/frontend
  index.ts
    export class Setting {}
    export class Card {}
    export class App {}
/backend
  index.ts
    export class Main {
      start() {}
      dispose() {}
    }
    export const oauth
    export class Sync {}
```

## Platform

Export `orbit-app` to the various apps.

Has:

- `Model.*`
