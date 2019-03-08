High Level to Launch:

1. Build System / Split Out
   1. App Editing CLI
   2. Environment improvements
2. Making non-syncing data providers like Postgres
3. UI Kitchen Sink
   1. Should be pretty comprehensive and can serve as the demo
   2. Lots of sub-fixing for performance and various polish in current components
4. App Configuration
5. P2P Syncing / Config Sync system
6. Onboarding, Settings, Account
7. Website
8. Documentation

---

Goal by end of March

- initial working app editing
- initial syncing of config p2p
- onboarding
- postgres example

---

Goal by end of April

- Website launch
- Documentation as well
- .app working with basic apps

---

Goal by end of May

- Distribute a beta with basic custom editing apps

---

Invidivual app improvements:

- Search

  - Filters can be moved into <Search.Settings /> + <Lists />
    - and made to work nicely together / with query bar

- People:

  - <People.Settings /> should let you manage people
    - Could let you just choose sources that sync people

- Lists:
  - Need to make <Stack /> <ListStack /> work
  - Then make <TreeList /> work
  - Then link back into lists app and make delete/sort work
  - Then make editing titles work
  - Then make main views quite a bit better
