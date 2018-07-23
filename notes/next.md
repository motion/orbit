- make orbit fast and fluid for exploring:

- decorators/HOC: https://github.com/Microsoft/TypeScript/issues/4881, https://github.com/DefinitelyTyped/DefinitelyTyped/issues/9951 https://stackoverflow.com/questions/39026224/how-to-compose-multiple-typescript-class-decorators
- p2p https://github.com/mafintosh/hyperdb
- hire https://github.com/theKashey
- ide https://retool.in/
- icons https://danklammer.com/bytesize-icons/
- nlp/filters https://github.com/NaturalNode/naturalhttps://github.com/spencermountain/compromise/wiki https://github.com/laconalabs/elliptical

# high level

## Events/Updates

Backend system to track updates to Bits. It would make homepage function better, search look better, and probably hook into profiles as well anyway.

## Crawler

May want to redo this so it uses their "default browser" if it's not too much trouble. Selenium may do that.

## API Search integration

Set up mostly a simple fake API that returns results so it can be shown.

## Search improvements

Start with just hst5 for sqlite, but eventually merge in cosal.

# nate

## product

- umed: building oracle
- perhaps could have an electron shell pre-build and symlink things in
- that would also give you a single .app to run?
- open bit on keyboard enter after search
- improve github peek design
- improve gdocs card and peek design
- gdocs strip out css stuff in header
- fix some github tickets not showing bodies
- run through a few searches and bugfix (duplicates)
- hover highlighted snippet in search to scroll to part in peek
- profile design 2.0: make it worth keeping open
- hmr fix: flash on orbit with no data for a bit
- settings panes: slack, folder

# Product strategy

- Syncers
  - sync a lot more (stable up to 5-10k each)
  - handle updates, removals
  - store recent activity in consistent manner
  - sync People from various integrations
  - stabilize and debug generally
  - add confluence and jira
  - ? add crawler
  - ? add custom API
  - ? add maybe salesforce
- Settings
  - finish all settings panes
  - keyboard shortcut settings
  - start at login settings
- Search
  - hts5 based search
  - - eventually cosal search
  - need some basic "x in y" search
  - needs performance and visual work
  - keyboard movement needs to scroll up/down
- Improve Peek and OrbitCard for various integrations
  - they all need quite a bit of work data/design wise
  - showing updates from recent activity
- Profiles
  - need to first have them aggregating
  - then need to design out profile cards
  - need to figure out featureset too for expert topics
- Bugfixing
  - all over
  - handle desktop changes
- Productionizing
  - smooth build to prod process
  - auto updates in app
- Website
  - signup process
- Setting up your team
  - Once you download app you can set up and invite people
  - Shows a modal saying "hey this will sync some basic stuff, not private data"
  - How does it handle integrations for various people
  - Would need to prompt for various integations
  - Would need to sync crawler settings
