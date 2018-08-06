# Umed week of Aug 6th

- Discuss handling mutations and updating in UI (Observable Ids work)
- Gmail scan emails based on slack and other emails
- Person:
  1.  Have a query that returns recent items across integrations under person profile
  2.  Person permalink from each integration
  - Slack: `slack://user?team=${setting.values.oauth.info.team.id}&id=${person.data.id}`
  - Gmail: `mailto:person@email.com`
  - rest not important for now...
  3.  Have a query that returns the "places" they spend time in most
- Small: Person higher res image from slack
- Small: simple "Delete integration" endpoint, deletes bits associated
- Small: syncers persist last sync state so on restarts it doesn't re-run often
- Small: syncers throttle various syncs so they don't all run at once (cpu)
- Small: Duplicate types for models... way to resolve?

Main Goals:

- Have people profile queries ready
- Have syncing set up for rate limits

Broken down:

- Discuss rate limit workaround method

  1.  We need a table that tracks the rate limits for each token and understands when they hit limits and writes to it.

  - Eventually this will be move into a DHT to do our magical rate limit workaround

  2.  We should auto-select popular things to sync in each setting once they are created and store those preferences into Settings, requires integration with frontend

  1.  For slack that is rooms they talk in often, we already manage this so it's just selecting them on creation
  1.  For drive thats just recently viewed and recently shared files
      1.  There's a concept of "team folders" i need to investigate that more
  1.  For gmail its:
      1.  recent 50k, should see if we can query their Starred or Primary inbox and if so just do that
      2.  whitelisted addresses based on any Person emails we find!
      - So if Slack has natewienert@gmail.com then sync last 10k natewienert@gmail.com emails for now
  1.  Confluence/Jira don't need any special rules just sync all

* Discuss gdrive search-drives-sync strategy

GDrive is the hardest one because extreme rate limits but also easiest to solve with the DHT. So we're going to start building up to DHT by simulating with a local sqlite table.

DHT:

- peers: (bit.identifier: string => Peer[])
  - "who has which bits synced"
- rateLimits: (integration.id: string => RateLimitInfo: Object)
  - "rate limit info for integration"

Steps:

- Read the current rate limit status.
- Sync slowly (avoiding getting past 20% of limit or so) popular files
- On search:
  - Debounce a bit more than local searches
  - IF have rate credits, do on-demand GDrive API search
    - Scan/insert Bits found and, show them to search results (near bottom of fold)
  - ON insert Bit.type === drive:
    - DHT.peers.push(myId: bitId)

Later we unlock p2p sync:

- Can just query for drive.history and use p2p network to sync docs using identifiers
- (1 history query vs. 1 + N queries)

# nate

## August

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
- Build to .app
  - SHOULD one command build to an .app that works
  - SHOULD have auto-port finding not hardcoded
  - SHOULD one command to push update
  - SHOULD show banner, update and restart once update is pushed
- Peek fixes
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

umed: syncers/people/events

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

- calendar support
- injest anything (instant crawler/snippets)
- memory
- contextual search
