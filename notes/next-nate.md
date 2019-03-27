- an API explorer interface that uses our forms + an object describing typed arguments, and then shows results in a table. shows your current apps in a sidebar, lets you test them all easily and see their APIs

  - as part of that, some higher level components in kit like `<QueryApp app={app} />` that we can let users use in apps to generically grab stuff from various apps

- a nice <Grid />, to easily just 'throw in' panes and have them look nice on any layout size, one that lets users edit it to flex in different ways

- using <Grid />, and <QueryApp />, put together a demo that shows a nice way to take slack messages, query them, then select a vew, see those in a different grid item as a stack, edit a few of them, then send them over to Gmail in a third grid item that has some configuration options for where to send them in gmail

- Search => Home
  - rename to home, update icon
  - move manage apps back into home
  - making the home more clear for launcher, show the grid by default,
    - make the grid actually search able in the main area instead of apps in search/index
  - adding app from home
  - simplify Create App
    - just give it a name, choose a simple list of types (main only view)

---

Views

- move to blueprint icons, free to distribute
  - https://blueprintjs.com/docs/#core
  - copy docs from https://sancho-ui.com/components/icon/
- Banner
  - Message => Banner
  - alt="warn" etc states
- Layout Grid
- API => Form automatically
- ActionBar
  - size=2
  - holds buttons
  - easy to align side/mid/end
- Nav/Theme
  - See how Flow has a custom nav?
  - Make that an official thing
  - But also!
    - See how Demo 1 / Demo 2 in custom apps wants the same style nav?
  - TWO THINGS
    1. Make `alt=""` customizable and have that as a theme
    2. Unify it so we are just able to do
       - <Tabs alt="underlined" /> and <SegmentedRow alt="underlined" /> etc
- Pane
  - collapsable / merge with panel
  - title/subtitle (titlerow)
- Multi-step flows + Multi-step forms
  - Flows need to handle:
    - Toolbar/actionbar buttons for next/prev easily
    - Validate next step before going on + show error banner
    - Disable navigation items based on validation
- Forms
  - need easy way to make them "uncontrolled"/editable
  - forms need improvement for label
  - forms need validation as well + error messaging
  - date view in forms
  - easy way to add your own custom forms
- Query editor views
- Moving into its own area useFilters or similar
- Theme can control fontWeight for themeing texts

- Making icon customization simpler
  - Just choose background color
  - We can manually overlay icon on top instead of custom-per-each

---

Apps generally:

- Would be nice if people can have their own ui kit they add on on top
  - that should work well with the app store generally

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
- <Toggle /> on/off button
- <Query />
  - we need a few ways to help people put together CRUD/query interfaces
  - <QuerySQL />, <QueryGraphQL />, <QueryREST />
- <Autocomplete /> with options you can fill in
- <Table />
  - Allow validators

---

website:

https://codesandbox.io/embed/ly0oxkp899
