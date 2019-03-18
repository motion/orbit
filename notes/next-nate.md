Views

- First class Filters

  - Either filter (Enum / <Select />)
  - Any filter (<MultiSelect />)

- Card

Should have the structure of:

[ TITLE ]

[ DT: DD ][ dt: dd ]
[ DT: DD ]

[ CONTENT ] (can be a simple table, list etc)

Small bugs

- Make <Interactive /> show a real div above other things so it catches mouse events
- Fix overflow scroll in virtual table demo

---

High level

- Make search hook into the table

- App Actions

  - <ActionBar /> would be nice alongside simpler <FloatingBar bottom />
  - API => <ActionButton />
  - Demo app with action to send to slack

- Unification app <=> searchbar <=> table

  - EnumFilter support in searchbar
  - App settings can define JSON-style EnumFilter
  - useSearch has filter state from OrbitSearchBar

---

March:

- Working app demo with code

---

April:

Website + onboarding

- Account/space

  - Get account page setup with actual login
  - Get space page simplified but working better
  - Put initial version of hyperswarm in

---

Month 1:

"Make apps work for initially closing the loop"

Week 1: Making some p2p and app install/settings stuff work
Week 2: Making Space management and Account signup work
Week 4: Fixing onboard/productionization issues, perhaps simple site for alpha

---

Month 2:

"Make a great demo for the website"

Week 1: Working on various apps to make them work better
Week 2: Putting together a app demos and documentation
Week 3: Get a rough first pass at website stood up by end of week
Week 4: Get a nice website with mobile + start on docs

---

small things:

Make most really dynamic and bigger views in @o/kit the main name: Table, Form, etc

Make the lowest level ones prefixed with `Simple`, so SimpleTable, SimpleForm.

The in between ones can be descriptive like SearchableTable.

---

components:

(Be sure to cross reference Expo, Flipper, Retool)

- <FilePicker /> (=> Table easy integration)
- <Table />
  - column type: `action` to support buttons on each row
    - then you can have an easy effect here, for ex POST somewhere
- <Select /> (can just be native, but with types)
- <Toggle /> on/off button
- <Query />
  - we need a few ways to help people put together CRUD/query interfaces
  - <QuerySQL />, <QueryGraphQL />, <QueryREST />
- <Autocomplete /> with options you can fill in
- <Table />
  - Allow validators
-

---

website:

https://codesandbox.io/embed/ly0oxkp899
