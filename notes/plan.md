## For Umed

Deliverable by:

- Tomorrow: Github syncer
  - syncs 5 repos lots of tickets and comments easily
  - handles deletes
- Wed: Confluence syncer
  - seed a fake confluence trial account with 50 pages
  - syncer uses Setting.values.username/password to go through REST API
  - syncs all 50 pages, handles updates and deletes
- Fri: Google Docs syncer
  - look at issues with can't fetch contents sometimes (time out), if cant
    figure out in 2hr bail
  - make it sync much larger amount (history tests)

Next week:

- People syncers: Confluence, GDocs
- add Jira syncer
- Upgrade slack syncer: sync full history of rooms, handle updates/deletes
  better

## Goalposts

two weeks: have a great demo

- Sync and search, reliably and well, Github, GDocs, Slack, Confluence, Jira
- People sync for a few things
- lots of ux

two weeks: refactor

- Do a two week sprint together to get app in shape
- Account for some platformization goals

two weeks: early build to alpha users

- Builds to prod with a command into nice app bundle, auto updates smoothly
- Settings panes all work well, look well
- Has more polish: nice tray icon, shortcut settings, onboarding
- People syncers work

two weeks: refactor+demo for platform

- Restructure for apps
- app store demo ux
  - create custom app, query slack messages, show some dashboard, 1-click deploy
    to team

three weeks: get a beta build

- Simple and nice signup process, sends email, downloads app
- Walks through integration setup on first start
- Syncs their preferences for integrations (not tokens just settings)
- General shared data system
- Lots of bugfixing and things we didn't expect

four weeks: real launch

- More integrations: crawler, API, etc
- Scaling, bugfixing
- Upgrade website, blog, social media, etc
- Team sync level features really stable
- Basic nlp features baked into profiles and search

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
- Onboarding
  - need better story for setting up and sharing integrations
- Website
  - signup process
- Setting up your team
  - Once you download app you can set up and invite people
  - Shows a modal saying "hey this will sync some basic stuff, not private data"
  - How does it handle integrations for various people
  - Would need to prompt for various integations
  - Would need to sync crawler settings
