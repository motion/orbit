# now

- auto update
- test .app on umed computer
- bugfix run through trello

MOVEMENT

- IF you have a grid/carousel view active THEN
  - WHEN you move down into selecting something
    - SWITCH L/R to only move between cards not panes
- CAROUSEL
  - make all carousels behave under one component that handles l/r scrolling

FOLLOW

- Small (+) button to the right of FilterBar with tooltip "Follow"
  - ON click add that search term to homescreen
  - models/Follow

ACCOUNT

- Signup on site for account
- That gives you a:
  - Download of Orbit app
  - Special license key
- Download orbit.app
- Add license key
- That lets you click to open a peek window for managing master keys

DESIGN

- Peek windows no more fancy theme just mac looking headers

# nate

## aug 14th

- auto updates
- everything needs a lot of work to feel nicer
  - fix a bunch of search bugs
  - make interactions faster with peeks
  - make peek positions and design better
- fix searches and keynav a lot
- speed up interactions
- lots of visual bug fixes

Aug 21st:

- p2p/app setup
- invite friend onboarding
- big polish run, empty queue
- iterate on bugs/profiles from deploys

Aug 31st:

- ready for workday demo...

# August details

p2p: https://github.com/mafintosh/hyperdb

## September

- Hire top frontender
- auto setup
- p2p sync with real features (rate-limit, pin-to-search)
- deploy it with 5 teams
- alpha ocr/memory/contextual-search

queue:

- SHOULD show banner, update and restart once update is pushed
- handle screen changes/resizes
- Masonry.fixedHeight mode for Directory/Settings cards (no double render)
- react-fast-compare local copy and fix comparison for our setting card (proxies breaking?)
- fix horizontal scroller to cut off nicer

- search: filtering "nick and nate" doesn't show any results for some reason
- make all searches work: task search, message search
- Remove setting button
- Google drive settings pane
- Manage tab for every one:
  - Stats card of total bits
  - Clear all bits
  - Remove integration
  - Can have login settings if applicable

## unnecessary for beta polish bucket

- shortcuts bar working
- cmd+z undo in search area (needs to work with toggles...)
- peek arrow position shouldn't straddle weird borders
- react-spring for peek placement
- styling on settings panes
- peek header styles
- hoverGlow needs fix for x/left just like top/y
- @mcro/color: increaseContrast, decreaseContrast
- test-app: fix themes/tabs
- fix orbitdocked resizing/overflow logic
- roundbutton hover more contrast
- Person titlebar borderbottom is weird
- no titlabar faderight to transparent on profile
- UI.Text not wrapping subtitlePrefix

## random dev notes

- hmr: doesn't store.unmount stores often
- react: await finishRender() could be interesting

# gamechangers

- personal home
  - idea is: netflix style scroll bars with titles
  - default they are just your integrations
  - "pin search" to follow that search in netflix (this can then be super powerful... nlp + dates)

* calendar support
* injest anything (instant crawler/snippets)
* memory
* contextual search
