NEXT

1. move `@mcro/services` to be inside `@mcro/apps` and co-locate types/services with apps

   - keep in mind we want to expose these services for other apps to use and people to write
   - so we need to make this also use all the same simplified APIs from `sync-kit`, etc
   - so some of the points below also apply to how you refactor the services:

2. Syncers simplify

2.1. no more `manager`:

    - for querying/inserting bits should just be two functions
    - for querying/updating the app data it should be just two functions
      - keep this pretty simple to start
        - `load()` and have it handle most use cases like count, many, one
        - `save()` and have it handle saving one or more

2.2. get rid of and really simplify a bunch of functions used now:

    - `BitUtils.create` => `save()`
    - `utils.loadDatabaseBits` => `load()`
    - `utils.syncBits` => `save()`
    - `utils.loadTextTopWords` => sync-kit `NLP.getTopWords()` API

2.3. make syncers leverage their Service much more heavily and make Services standardize around their synced `BitContentType`:

    - this should let us really simplify syncers down a lot more and make APIs easier for things that use BitContentTypes
    - for example with slack, you make the service do all the heavy lifting:
      - `const api = new SlackAPI(app)` => this would handle all internal state related to sync
        - for example cursors and updating app last modified, etc
        - SlackAPI would also normalize all calls so it returns a `Conversation` type
      - `api.getUpdates().map(messages => { save(messages) })`
        - this is the ideal sort of API for syncer
        - SlackAPI can understand how to convert the raw slack data into Conversation type
        - it also can handle cursor/pagination/last-sync etc sort of stuff
        - so in the syncer you basically don't do much at all, just use the service, save

2.4. turn anything that requires "node" to become a package imported:

    - stuff like `jsdom`, turn it into an API call we control in `sync-kit`
      - so instead of importing/using `jsdom` directly:
        - just `import { parseDOM } from 'sync-kit'`
        - `parseDOM` is just a command that resolves to jsdom in the backend

---

- types: models/entities dont have required types, can we make that enforced?
  - AppBit should have required types: identifier, spaceId, name
- bugfix: if you rm sqlite database, then startup, it gives a sql error first time
- Turn on strict null checks in TS and fix so we can use it going forward
