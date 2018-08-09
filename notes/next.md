# now

- auto update
- test .app on umed computer
- fix directory index/select bug
- better design for "Add integrations"
- fix search empty results on names
- bugfix run through trello

# nate

## review week to aug 7th

- everything needs a lot of work to feel nicer
  - fix a bunch of search bugs
  - make interactions faster with peeks
  - make peek positions and design better
- the settings needs to feel more "store-like"
  - list-style apps in the "add integration" section (rename to "add apps")
    - should have a description underneath in english and nice "add button"
    - ideally even have a screenshot
  - can live search through "apps" and add easily
  - showing realtime sync info on integations feels futuristic

## August

Aug 14th:

- auto updates
- redesign home
- redesign settings/apps
- fix searches and keynav a lot
- upgrade visual look a lot
- speed up interactions
- lots of visual bug fixes

Aug 21st:

- p2p/app setup
- invite friend onboarding

Aug 21st:

- big polish run, empty queue
- iterate on bugs/profiles from deploys

Aug 31st:

- ready for salesforce demo...

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
