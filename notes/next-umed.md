NEXT

After this we will move into new data sources, first up, Postgres:

- Postgres App with Query API
- We need a fake local postgres we can all test against, in the app
  - Set up on bootstrap
  - Runs alongside the app for now
  - Show working Query on client side just from REPL

Notes:

We need to figure out how to do this fairly similary across any type of data source.

Found this:

- https://github.com/dbohdan/automatic-api

Question is do we want to go graphql based? It has some upsides and downsides...

---

- types: models/entities dont have required types, can we make that enforced?
  - AppBit should have required types: identifier, spaceId, name
- bugfix: if you rm sqlite database, then startup, it gives a sql error first time
- Turn on strict null checks in TS and fix so we can use it going forward
