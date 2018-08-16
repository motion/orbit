- <UI.Theme select={theme => theme.titleBar} />
  - that takes the subset from theme.gray.titleBar
    - which means that can have specific button styles nicely :D

# Week ending Aug 17th

**Production build that properly handles OAuth sync for a real-world user**

- Oauth key strategy:
  1.  UI/storage for adding your own oauth keys as master/admin
  2.  Using those keys in Passport
  3.  Documentation to onboard for creating your own keys
      - should be built into app as well as on a website
      - https://docs.tryretool.com/docs/sso-google-and-okta
- Finish settings panes

On Umed's side:

- Final syncer fixes, as much as possible
- Mutation/observe pattern for data updates
- More People aggregation
- Help fix build to prod on older mac

# Week ending Aug 24th

**Syncer/UI improvements and P2P system for sharing the app and sharing oauth config**

- SAML login support
- Website signup / onboarding
- Website docs deploy
- Lots of bugfixing and polish with search / people aggregation

# Week ending Aug 31st

**Ready for workday...**

---

---

---

UI

- Peek windows no more fancy theme just mac looking headers
- Add button for settings panes that easily lots into with table
- Confirm native modal for Remove setting
- Fix themes a lot in terms of color choice
- Theme psuedo state better strategy
- able to have for example: Dark.card theme and apply a custom states easily per-component:
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

- calendar support
- injest anything (instant crawler/snippets)
- memory
- contextual search
- component store
- forking apps / app store
