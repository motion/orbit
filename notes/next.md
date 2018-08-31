# September

app platform demo, p2p sync, search

- RSS Syncer means we can actually publish an RSS feed of updates to orbit users :D
  - and can hardcode it for them so theres content there on first start
- Login/signup/onboarding completion
- Figure out Google/https oauth workaround
- p2p system for avoiding hitting syncers
- Iron out a lot of bugs and syncer issues
- Refactors and build app for app platform
- hstf5, cosal search integrations

# October

app platform

- Continue on UI kit for apps
- Get the basic app store in place
- If Swift contractor works out integrate some OCR
- Prep website for private beta launch

# November

Private beta

# productionize

- typing while focused on a peek:
  - reset index to 0 not -1, keeps the peek open as you filter things
- doesnt follow monitor on add new monitor
- deploy initial oauth step to digitalocean
- need a way for people to suggest/vote features
- sort the queues by most recent at top so you can quickly hit emails
  - should be fully keynav so you can get to links inside them quickly
  - show html in emails
- slack room
- email list email
- remove confluence
- make onboarding encourage adding more integrations
- only have them download .app and auto move to apps folder
- slack orbit-fam #revolution
- close orbit while oauth open so it doesnt cover it
- better show the panes on onboard
- after onboard "what can i do / search?"
- typeform survey to capture a few potential paths
- location filters: `.find({ location: { name: "..." } })`
- in:x for location
- clicking location buttons should filter that location
- direct open button in search results
- clicking a name should search that name
- find by type (file / link is helpful)
- search results date strategy:
  - do separators based on time periods:
  - do by day for first week within the current month
  - do by month after that
- Fix empty profiles from gmail contacts import
- Fix slack not showing usernames
- Fix intra-peek clicking
- Slack select all settings by default (syncer needs to respect settings/set them)
  - Toggle select all button in table view
- working remove integration
- fix highlight index click interaction
- fix integration buttons styling and going inactive after click
- Finish settings panes
- Ask for survey _after_ onboarding...

## Website signup for beta

- Signup process
- Account manage area
- keygen.sh
- Secure source code
- Documentation for onboarding
- Questionaire

## Orbit 1.1 best guess

- Better movement and displays
- Profiles upgrade
- Cosal
- Account/settings upgrades
- Search upgrades
- Attachment/file previews
- Follow topics

---

# GameChangers

## App store

- Platform refactor
- Simple p2p app deploy system
- Improve Manage Apps pane with a few extras
- Website / Documentation of UI components

## Realtime Search

## Brain

- Ridiculously easy indexing

---

# August details

p2p: https://github.com/webtorrent/bittorrent-dht

## September

- p2p sync with real features (rate-limit, pin-to-search)
- deploy it with 5 teams
- alpha app store

## unnecessary for beta polish bucket

- cmd+z undo in search area (needs to work with toggles...)
- peek arrow position shouldn't straddle weird borders
- react-spring for peek placement
- hoverGlow needs fix for x/left just like top/y
- @mcro/color: increaseContrast, decreaseContrast
- UI.Text not wrapping subtitlePrefix

## random dev notes

- hmr: doesn't store.unmount stores often
- react: await finishRender() could be interesting

# potential gamechangers

- calendar
- injest anything (instant crawler/snippets)
- memory
- contextual search
- component store
- forking apps / app store

# apps

home queues:

...

search apps:

- calculator
- local file search
- wikipedia lookup
- map lookup

peek apps:

- just needs internals + documentation

component store:

- https://github.com/jlfwong/speedscope

later:

- deploy orbit apps to a hosted instance possible eventually
