# September

- Hire top frontender
- auto setup
- p2p sync with real features (rate-limit, pin-to-search)
- deploy it with 5 teams
- alpha ocr/memory/contextual-search

# August

Aug 7th:

- Auto onboarding flow/history-scan/notifications/tray-guide
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
- Better app home
  - SHOULD have simple query for mixed recent things by default to start

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

auto setup:

1.  startup orbit, nothing shows!
2.  scans your chrome history
3.  shows in Tray (Setting up Orbit...)
4.  do exactly how fantastical gmail setup works
5.  open chrome tab with the oauth already active (not button page)
6.  at the end show a sucess notification
7.  cycle to next integration to set up
8.  once all done, open orbit and do a tour

queue:

- fix date filter interaction
- search: filtering "nick and nate" doesn't show any results for some reason
- make all searches work: task search, message search
- Remove setting button
- peek use Meta bar
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
