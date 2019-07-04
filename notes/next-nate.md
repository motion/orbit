next

- "/" in search bar slides up AppsDrawer with Home/Search app for searching
  - that makes it contextual which means we can potentially do drag/drop into lists!!!
- opening app windows into own space
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

Visual Fixes:

- Lists search+select seems to have regressed, could be new react-window
- Fix GraphQL Explorer interface small glitches

Install apps:

- Test loading multiple different workspaces and apps

Edit apps from interface:

- Get editing apps working from UI
- Test full edit => publish flow with build to production command
- Needs some visual feedback with banners/messages

Launch App into own window:

- Get this working again, test it out with new code

Workspaces:

- Get second example workspace setup
- Move between the two workspace in the interface

App Settings:

- Fix app settings various bugs that have come up
- Make CRUD of settings work wel

Demo apps:

- Get demo apps imported into Example workspace
- Iterate on a few of them together with real app data

Dock:

- Get the QueryBuilder into the dock
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

- Apps page show details + improve faq
- Add faq to about page

## Next

- Grid persistance, Slack import app

## Good enough demo to Ken Wheeler / et al:

- Easy way to pull in any app "data explorer" and have it visually show light config to let you set
  up a query.
  - Perhaps as a generic cardview that "flips around" for config.
- Editable grid that persists (with add/remove)
- Drag/drop for tables/lists
  - Draggable
  - Droppable
- A full grid app that with:
  - Customer service + Postgres
- A full grid app that with:
  - JSONPlaceholder + Albums, etc
- A full multi-pane app with:
  - FBFlipper type inspector that hooks into system calls
- `<QueryApp app={app} />` that we can let users use in apps to generically explore any apps
  interface
- Slack/Gmail demo app: <Grid />, and <QueryApp />, put together a demo that shows a nice way - to
  take slack messages, query them, then select a vew, see those in a different grid item as a stack,
  edit a few of them, then send them over to Gmail in a third grid item that has some configuration
  options for where to send them in gmail

## Better demo:

- Improve Share
  - "Persist" share button to clone it to a new one for multiple clipboards
- automatically show multiple Main views with multi-select
- Lists app (shows CRUD app with persisted data)
  - accepts dropped in users/search
  - make history/drilling work
- Forms
  - need easy way to make them "uncontrolled"/editable
  - <Toggle /> on/off button
  - Need Calendar, Number, Slider, Range
- Search app (shows Search API features)
  - Simplify and improve content views
  - Remove the grouping and use virtual lists
  - Fix cosal search

## Get it in hands:

- Spaces
  - Needs to be simplified and then made to work
  - Enforce a "slug" so we can store it on disk somewhere
- Create App
  - Simple just one color pick
  - Templates option for new app
    - Blank, Master/Detail list/detail, Grid, Vertical Split

Beta:

- Forms
  - <FilePicker /> (=> Table easy integration)
  - Need to build out some demo forms like in retool
  - forms need validation as well + error messaging
- Editable titles that persist
- Banner
  - alt="warn" etc states
- Bonus demo apps:

  - People app (shows custom content type app)
  - Search app (shows Search API features)
    - Simplify and improve content views
    - Remove the grouping and use virtual lists
    - Fix cosal search
    - Bonus Home
      - making the home more clear for launcher, show the grid by default,
      - make the grid actually search able in the main area instead of apps in search/index
      - adding app from home

- DataExplorerApp
  - Needs to allow for basic REPL + persisting user state

---

(if all that is done, bonus stuff)

- Unification app <=> searchbar <=> table
  - EnumFilter support in searchbar
  - App settings can define JSON-style EnumFilter
  - useSearch has filter state from OrbitSearchBar

---

- document for apps + apis

- a nice <Grid />, to easily just 'throw in' panes and have them look nice on any layout size, one
  that lets users edit it to flex in different ways

---

large rows filter/search in browser (https://github.com/nextapps-de/flexsearch)

---

make gloss work with shadow-root; not too hard:

1. <ThemeConfig rootElement={shadowRootRef} />
2. GlossView(props)
   1. => glossify(styles, context.rootElement)
   2. => sheet.addStyles(rootElement)

---

make a big table of all the state/alternates for button/tag/etc
