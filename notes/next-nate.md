-- High level

First: working, non-buggy demos of everything:

~1.5 months

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
