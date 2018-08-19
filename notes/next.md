- direct open button in search results
- clicking location buttons should filter that location
- clicking a name should search that name
- find by type (file / link is helpful)
- search results date strategy:
  - do separators based on time periods:
  - do by day for first week within the current month
  - do by month after that
- slack search needs to be not one big paragraph
- and needs to show name next to message in the main pane
- "in (location)" nlp for slack rooms especially
- Oauth: Properly proxy/prompt the production domain in prod mode
- Fix horizontal scroll bugs
- Fix empty profiles from gmail contacts import
- Fix slack not showing usernames
- Fix intra-peek clicking
- Fix blur in prod build on other macs (test on my other mac)
- Onboard fix final bugs
- Onboard click tray to focus
- clear peek on scroll searches
- make search better without using peek
  - peek should also show infinite scroll of related things
- Slack select all settings by default (syncer needs to respect settings/set them)
  - Toggle select all button in table view
- working remove integration
- fix highlight index click interaction
- fix integration buttons styling and going inactive after click
  - Confirm native modal for Remove setting
- Oauth key strategy:
  1.  UI/storage for adding your own oauth keys as master/admin
  2.  Using those keys in Passport
  3.  Documentation to onboard for creating your own keys
      - should be built into app as well as on a website
      - https://docs.tryretool.com/docs/sso-google-and-okta
- Finish settings panes
- Mutation/observe pattern for data updates

# Week ending Aug 24th

**Syncer/UI improvements and P2P system for sharing the app and sharing oauth config**

- SAML login support
- Website signup / onboarding
- Website docs deploy
- Lots of bugfixing and polish with search / people aggregation

# Week ending Aug 31st

- Search improvements and bugfix
- p2p system in place
- deploy to a few friends

UI

- Add button for settings panes that easily lots into with table
- Theme psuedo state better strategy
  - hover: [brightenBorders(0.1), biggerShadow(1.5)]
  - active: [darken(1.1)]

# August details

p2p: https://github.com/webtorrent/bittorrent-dht

## September

- Hire top frontender
- auto setup
- p2p sync with real features (rate-limit, pin-to-search)
- deploy it with 5 teams
- alpha ocr/memory/contextual-search

queue:

- SHOULD show banner, update and restart once update is pushed
- handle screen changes/resizes
- react-fast-compare local copy and fix comparison for our setting card (proxies breaking?)
- make all searches work: task search, message search
- Remove setting button
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
- fix orbitdocked resizing/overflow logic
- roundbutton hover more contrast
- Person titlebar borderbottom is weird
- no titlabar faderight to transparent on profile
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
