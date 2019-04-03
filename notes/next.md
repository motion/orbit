Technical high level:

1. Build System / Split Out
   1. App Editing CLI
   2. Environment improvements
2. Making non-syncing data providers like Postgres
3. App Configuration
4. P2P Syncing / Config Sync system
5. Onboarding, Settings, Account
6. Website
7. Documentation

---

Product high level:

# GET CUSTOM APPS WORKING!

All custom apps take the same form to start:

1. Query data from (CSV, Postgres, Redshift, Google Sheets, S3, GraphQL, Stripe)
2. Show data in a table with (selectable="multi", sorting, filtering, searching)
3. Select items in that table and see a form with the values (String, Date, ??)
4. Have an action button on that table to then send form data to (Email, Salesforce, Github, Slack)

---

Goal by end of April

- example apps
- website
- start on cli (workspace management)

---

Goal by end of May

- Website, fully working start to finish custom apps

---

Goal by end of June

- Beta launch

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
