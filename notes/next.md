Umed week of Aug 6th

- Discuss rate limit workaround method
- Discuss gdocs sync/search strategy
- Gmail scan emails based on slack and other emails
- Person fix higher res image from slack + id for permalinks
- "Delete integration" endpoint
- Syncers: persist last sync state so on restarts it doesn't re-run

# August

Aug 7th:

- Auto onboarding flow/history-scan/notifications/tray-guide
  - SHOULD show in Tray (Setting up Orbit...)
  - SHOULD show ORBIT saying "hello", and "start auto-setup"
  - SHOULD scan history and open sites in order based on matches
  - SHOULD show integration in orbit as it asks for integration
  - SHOULD show "proxy active" and privacy message during final step of integratino
  - SHOULD show nice progress menu of integrations
  - SHOULD show other options at the end
  - SHOULD show scan status during setup
- fix automagic deep causing bad updates
- Build to .app
  - SHOULD one command build to an .app that works
  - SHOULD have auto-port finding not hardcoded
  - SHOULD one command to push update
  - SHOULD show banner, update and restart once update is pushed
- Peek fixes
  - dont let it go too high
  - fix horizontal scroller to cut off nicer
- Settings panes all fully working
  - SHOULD have general setting for shortuct
  - SHOULD have setting for start on login
  - SHOULD have Orbit area:
    - SHOULD allow adding a new Orbit team in UI with peek input + add button
- Minor bugs
  - SHOULD fix shortcuts by having electron register globalShortcuts only when focused
  - SHOULD have simple query for mixed recent things by default to start
  - SHOULD handle screen changes/resizes
  - SHOULD have open keyboard shortcuts work

Aug 14th:

- account system in cloud
- p2p keyshare/syncer dedupe
- invite friend onboarding
- deploy to Matt/Kevin/friends

Aug 21st:

- big polish run, empty queue
- iterate on bugs/profiles from deploys

Aug 31st:

- ready for salesforce demo...

# August details

p2p: https://github.com/mafintosh/hyperdb

# September

- Hire top frontender
- auto setup
- p2p sync with real features (rate-limit, pin-to-search)
- deploy it with 5 teams
- alpha ocr/memory/contextual-search

queue:

- search: filtering "nick and nate" doesn't show any results for some reason
- make all searches work: task search, message search
- Remove setting button
- Google drive settings pane
- Manage tab for every one:
  - Stats card of total bits
  - Clear all bits
  - Remove integration
  - Can have login settings if applicable

# unnecessary for beta polish bucket

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

# random dev notes

- hmr: doesn't store.unmount stores often
- react: await finishRender() could be interesting

# gamechangers

- calendar support
- injest anything (instant crawler/snippets)
- memory
- contextual search
