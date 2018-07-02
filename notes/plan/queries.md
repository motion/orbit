// @mcro/queries/jobs

```ts
import { Job } from 'models'
export const lateJobs = extraOptions => {
  return Job.find({
    where: { late: true },
    ...extraOptions,
  })
}
```

// @mcro/queries/index.ts

```ts
export * as Jobs from './jobs'
```

// in the app...

```ts
import { Jobs } from '@mcro/queries'
await Jobs.lateJobs().where()
```
