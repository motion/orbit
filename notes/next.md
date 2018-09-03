# Week of Sep 2 goal

- Have a really great first deliverable app
- Better sync, better search, fix lots of bugs

# Umed Week of Sep 2

- Make all syncers sync a more/better
  - Gmail super slow
  - Gmail no html coming back?
  - Really simple throttle
  - Auto sync more by default: everything should just "sync" a lot when you add it (default whitelist a lot)
    - for gmail, dont sync full history, but do sync a trailing X months or limited # of items
  - PersonBit query recent + limit
  - Slack.people sometimes still not showing up
  - Github not normalizing createdAt timestamps properly
  - Github sync auto select everything by default
  - GDocs auto sync most things by default
- Really simple RSS Syncer

# Nate week of Sep 2

- better way to log errors in prod and send logs from prod app automatically
  - log everything to /Application Support/Orbit/activity.log
  - have a MenuItem for Report Activity...
- searchresults - keep scroll at top of pane makes it possible to move quickly down
- hstf5
- Cosal merged into search and people profiles
- Signup process that links to real in-cloud db for accounts
- Attach account to orbit app

# September:

- Rate limits may be per-token so we may not need fancy p2p stuff (or not yet)
- Contacts
  - Reach out to stuart for meeting Workday
  - Convince tstuart to do Swindler and get on video call to discuss OCR
  - Give Karthik (SpaceX) demo app to use:
    - Requirements:
      - Add in basic Cosal search
      - Add in basic topic modeling for people
  - Reply to Andy properly, give update
- Community
  - Start community
    - Get a first beta build cut
      - deploy https/private.orbit.com with letsencrypt
      - Iron out a lot of bugs and syncer issues
      - Cosal early integration for search/profiles, maybe hstf5
      - RSS Syncer
    - Start Orbit friends chat
    - Typeform survey
    - Orbit home has RSS that has Orbit Updates + Orbit Help
      - Updates are latest dev notes
      - Help is for onboarding onto Orbit, shows its power
      - Make the default home screen be "Orbit Updates"
      - Twitter as well, we can IFTT our twitter into rss
- Sales
  - We should have tiers for support
  - We can do 50% off for early users lifetime
  - 25k, 50k, 100k or something to start
- Account system
  - This should let people set up an Orbit and share the config with friends
- Hire
  - Find someone to work on the swift OCR system

# October

app platform

- Able to make your own "Pages/Spaces/Homescreens"
  - By default it splits them by Location in a new Pane for each App
  - We can also have an example of Design blogs example
- Continue on UI kit for apps
- Get the basic app store in place
- If Swift contractor works out integrate some OCR
- Prep website for private beta launch

# November

Private beta

# next

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
