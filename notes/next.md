# next

- make older macs not have transparent bg

friday goals

- 90% of deployable .app
  - onboarding much improved
  - profile/theme cleanup
- typeform survey to capture a few potential paths
- (bonus) oauth key management

## Deployable .app

- productionize: fix proxy process for prod

- oauth:
  - when going through flow show orbit
  - show message:
    - "Private Auth Mode"

"Orbit proxies the keys directly to your computer.
You and only you receive the key to your data.
And just to be safe, our servers disable logs and deny all requests. Learn more."

- Properly proxy/prompt the production domain in prod mode
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
- Onboard click tray to focus
- Slack select all settings by default (syncer needs to respect settings/set them)
  - Toggle select all button in table view
- working remove integration
- fix highlight index click interaction
- fix integration buttons styling and going inactive after click
- Finish settings panes

## Oauth custom keys

- Oauth key strategy:
  1.  UI/storage for adding your own oauth keys as master/admin
  2.  Using those keys in Passport
  3.  Documentation to onboard for creating your own keys
      - should be built into app as well as on a website
      - https://docs.tryretool.com/docs/sso-google-and-okta

## Website signup for beta

- Signup process
- Account manage area
- keygen.sh
- Secure source code
- Documentation for onboarding
- Questionaire

## Orbit 1.1 best guess

- Big bugfix run
- Profiles upgrade
- Cosal
- Account/settings upgrades
- Search upgrades

## Orbit 1.2 best guess

- Management features
- Better filtering by type/location
- Attachment/file previews
- Follow topics

## Requested features best guess

- Custom lists
- Better search in 10 ways
- Support for X integration

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

# Small things

UI

- Theme psuedo state better strategy
  - hover: [brightenBorders(0.1), biggerShadow(1.5)]
  - active: [darken(1.1)]

# August details

p2p: https://github.com/webtorrent/bittorrent-dht

## September

- p2p sync with real features (rate-limit, pin-to-search)
- deploy it with 5 teams
- alpha ocr/memory/contextual-search

queue:

- SHOULD show banner, update and restart once update is pushed
- handle screen changes/resizes
- react-fast-compare local copy and fix comparison for our setting card (proxies breaking?)
- Google drive settings pane

## unnecessary for beta polish bucket

- make ui themes better
- <UI.Theme select={theme => theme.titleBar} />
  - that takes the subset from theme.gray.titleBar
    - which means that can have specific button styles nicely :D
- cmd+z undo in search area (needs to work with toggles...)
- peek arrow position shouldn't straddle weird borders
- react-spring for peek placement
- hoverGlow needs fix for x/left just like top/y
- @mcro/color: increaseContrast, decreaseContrast
- test-app: fix themes/tabs
- UI.Text not wrapping subtitlePrefix

## random dev notes

- hmr: doesn't store.unmount stores often
- react: await finishRender() could be interesting

# potential gamechangers

- personalize your profile
- calendar
- injest anything (instant crawler/snippets)
- memory
- contextual search
- component store
- forking apps / app store

# interesting apps to build

home queues:

...

search apps:

- calculator
- local file search
- wikipedia lookup
- map lookup

peek apps:

- just needs internals + documentation
