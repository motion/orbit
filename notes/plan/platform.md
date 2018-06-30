Platform

```
npm i -g orbit
orbit new
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
