
---

-- High level

First: working, non-buggy demos of everything. Visually impressive.

- Move search out of drawer and make "/" just work on OrbitSearchResults
- Add PermanentLast item AppShowBit in carousel (basically search app)
- Drag/Drop with OrbitSearchResults
- Get interaction with search + show AppShowBit proper
- Fixing bugs with carousel/drawer/drop


Fix query builder postgres loop with drag/drop
make a generic app for search + display data that you can drag a query into
make user manager app use grid layout probably
make slack app search something large and put it into layout demo app or similar

---

planning for workspaces:

workspaces:

refactor for actually working in prod:

1. we should verify and ensure we run cli externally not in desktop
2. we need to move things into a single unified build system:
   1. right now we have webpack building
   2. + we have nodeDefinitions loading into the backend
   3. + we have appMeta loading into the backend
   4. so we need to basically really look at the requirements above and redo it
   5. ideally have something like:
      1. webpack watches everything, builds everything
      2. on webpack finish build: send UpdateAppInfo command to desktop
      3. that command then should probably propogate to the client as well
         1. Either send command like UpdateAppInfo to client, or Desktop.state.workspaceState
3. we need to then build to prod and begin the process of making it all work legitimately, and covering all the use cases and bugs we missed

small fixes:

- dont run scripts on install (--ignore-scripts or similar for yarn)

make them work better (easier to manage/work with):

1. copy from node_modules into your workspace folder
2. delete the original node_modules and symlink workspace back into node_modules
  1. this lets users edit them as though they were their own
  2. but they still all work naturally through node_modules
3. automatically modify all package.jsons, adding every other workspace app as you install them
  3. lets you not have to manually do a ton of linking
4. similarly, we _could_ do the same for tsc + project references
  4. (or we could just handle it all in orbit ws)
5. this similarly helps with forking

---

# PART 1

"User management to flow of data through apis"

## USER MANAGER

1) User manager app uses real postgres data
2) Selection from user manager app shows in clipboard
3) BUTTON in user manager takes you over to Flow app

## FLOW

1) Flow automatically receives the data from user manager
2) Optionally you can go into Clipboard, drill into the selection, grab a few rows, change it
3) Steps of flow:
   1) Select some users on left side + Edit them in a form on the right side
   2) Customize a template for sending some emails to them
   3) Confirm it visually + hit BUTTON to send emails (should show off linking into an API, we could just do Slack or something for now)

# PART TWO

not sure...

wants:

"Easily interacting with APIs"
"Local data you can manage / share with team"

concretely:

querybuilder for postgres or some other
card app + apis (slack grab some data)
move that data into a list
table with a variety of filters easily defined

---



-- Next, sorted for me:




---

cool idea, dont do yet:

- "Actions" dock item, shows all actions from all apis, lets you search easily
- You can then take any selection and drop it onto an action to pull up some sort of structued data editor thing


next

important next:

- getting the full edit flow working including publish/update etc

umbrella type things:

- get working animation primitives within views
- get working drag and drop generally with easy drop targets

those together are just nice, second one really helps with moving data between apps.

- edit apps from within orbit
- publish apps from within orbit
- create app from within orbit
- querybuilder => dock
- dock => views (`<QueryCard />` or similar)
- dock => views (drag and drop, see if beautiful-dnd is ready for virtualized)

- BUILD TO PRODUCTION

June Goals:

QueryBuilder:

- Fix layout issues:
  - On mount it shows the sidebar large, then resizes it down
- Error/Success messages:
  - Show an error message on errors
  - Success message on success
- Get parameters working
  - Add new parameter
  - Select type properly
  - Insert into query
  - Show in preview
- CMD+Enter to run query
- Fix Output JSON showing properly
- Fix topbar tabs
- GraphQL editor

Edit apps from interface:

- Get editing apps working from UI
- Test full edit => publish flow with build to production command
- Needs some visual feedback with banners/messages

App Settings:

- Fix app settings various bugs that have come up
- Make CRUD of settings work wel

Dock:

- Get dragging from dock into apps (as part of demo apps as well)
- Export options (to file/json/api)

Website:

- Join slack + prominent
- Search/Now
- Apps/Faq
- Blog/update-two
- About/#sublinks
- Footer/links
- Docs
  - Docs/Search
  - Docs/toggle code
  - Docs/sidebar small fixes
  - Docs/Start card links
  - Site/host on now.sh for sub-pages, https, squircle assets, etc
  - Layout
  - Pane
  - GridLayout
  - Toolbar
  - Form
  - Text
  - Flow
  - Select
  - Input
  - Title
  - Message
  - Banner
  - Chat
  - Document
  - Markdown
  - Task
  - Thread

---

July

"Make demo apps work better, esp with adding sources and showing data"

Aug

hire......... so someone can do "Really be able to develop an app"

me: "Really be able to sync config between"

Sep

"Have good demo apps"

Oct

"Fix up site and onboarding for launch"

Nov

"Sell it to some early users"

Dec

"Launch"

---

large rows filter/search in browser (https://github.com/nextapps-de/flexsearch)

---

make a big table of all the state/alternates for button/tag/etc

---

ideal levels of logging:

1. just database mutations: save() actions
2. + om actions
3. + mobx actions
4. + mobx reactions
5. + useState and hook level update
6. + why-did-you-update all render information

you can layer them, or isolate any one

debug() // all / toggle
debug(0, 4) // through
debug(4) // only

---

- big goal for apps:
  - could totally hack this:
    - https://www.fcvl.net/vulnerabilities/macosx-gatekeeper-bypass
  - have it create a new app icon on your desktop
    - switch workspaces from tray
    - remembers all your last open orbit windows + state

---
- Create app creates new app and folder somewhere on machine
- Folder installs @o/kit and other things for app building
- When you hit "edit" it runs a dev server and shows the development app
- When you hit "publihs" it builds and updates
- Publish to github and other apps see it

Goal #1: Getting Apps to build/share

1. A way to publish and receive published apps (npm powered, like vscode)
2. A service for publishing apps online with various commands / CRUD
3. Link that service into orbit-app AppsIndex search

Goal #2: Syncing configuration and other information p2p

1. App config and space config should sync through hyperswarm
2. Link that into Spaces and testing it out

Goal #3: Apps store for p2p

1. In the same way public one works, but instead uses hyperswarm
2. Allow for teams to collaborate without publicly sharing anything
3. May need some consideration for linking to github repo (instead, in addition to?)

Goal #4: App building CLI

1. Not sure if this should go above the first goal, or parallel with it
2. In cli:
   1. Should be able to init a new app, have our @o/build run it and compile it
   2. Should be able to start/stop/create/publish apps generally
3. In orbit-app:
   1. Should be able to create custom app, then hit "edit" and have it run with CLI
   2. Should then swap the running app into development mode and show the dev-server output
   3. Should be able to edit the app with hot reloading
   4. Should have a nice error catching mode for that
   5. Should finish by hitting "Preview" at which point it will compile into prod mode
   6. Should in "Preview" mode let you use the app with prod compile, then hit "Publish"
   7. Publish should then work with the p2p publishing service to push app and update everyone

---

Questions:

-
---

- Apps + APIs and how "far" we should go: libaries / NLP is a good example case

small:

- gloss could probably memo pretty well, should make adjustments using the benchmarks
  - custom memo function:
    - if children set, dont memo at all
    - do a few smart props that we know are usually POJOs
