- actions are breaking hmr

- slack card:
  - if it was a post in #status, show other posts by that person in #status
  - fix people cards

# high level

## Profiles

First need to design out really ideal profiles. Make peek a bit bigger. Then need to figure out what it would take to show that.

## Events/Updates

Backend system to track updates to Bits. It would make homepage function better, search look better, and probably hook into profiles as well anyway.

## Crawler

May want to redo this so it uses their "default browser" if it's not too much trouble. Selenium may do that.

## API Search integration

Set up mostly a simple fake API that returns results so it can be shown.

## Onboarding

Basically we need a server to sync settings and handle signups. Everything from initial signup to emailing them, and then to storing their settings and syncing them between teams.

## Search improvements

Start with just hst5 for sqlite, but eventually merge in cosal.

## Scaling improvements

A lot of stuff here, beginning by just implementing syncers and testing them up to big amounts. Adding indices. In the end what would be ideal is if we can basically remove lots of "extra" data stored by just storing the keywords minus stopwords, plus a vector. And then do vector search along with normal search. And when we need more data on the frontend to show it, just use a service to pull on-demand. That would potentially enable 2-4x more storage on our end. Combine with CEVFS and could be another 2x or more.

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
- part parser of searches:
  - initially:
    - [integration] xyz
    - xyz in [integration]
    - @person
    - [integration] @person
    - @person [integration] xyz
    - xyz @person @person [integration]

## dev

- hmr fix: flash on orbit with no data for a bit
- potentially crawler
- settings panes: slack, folder

bugs:

- SQLITE_BUSY: database is locked

1.  Search

- shows summarized and nice meta info for things
- type something else - is fast and fluid
- pin to top of search (or drag to order it?)
- pin to news
  - this highlights asynchronous communication
- keyboard nav: should scroll down as you move down so its easier to see
  - after you click down one, have it expand to full screen
  - before you go down, have it be limited height

3.  Directory

- search to filter a person
- peek to show person
- aggregates a few things

last demo:

- home
  - show a github ticket
    - show the most recent action preview there
  - show a team card with inline update
  - peek conversation and "Pin to Team"
    - react-spring peek move
- search
  - slack:
    - list all links, then filter by room, then by person
    - list all attachments, see in grid
    - shows topic summarized convos nicely
  - topic search would be nice
  - "pin to search"
- directory
  - show profile
  - show team peek card
- apps

  - final wow
  - click "create app", paste in some code
  - realtime HMR edit
  - shows up in Home

- write three articles from write.md
- site:
  - 1 week
    - fossa/expensify/??? logo/quote
    - update site with video intro
    - update site with blog posts
    - polish everything to better explain (features use cases)
    - post articles to HN, PH, dev twitter, etc
- start twitter and tweeting, follow a bunch of good and similar accounts

  - setup tweetbot or something to manage

- hire:
  - start with syncers + panes
    - do one syncer/pane at a time
    - google docs
    - google mail
    - slack

# dev

## high level

- p2p sync system
- merging cosal
- major fixes for settings, syncers, etc
- productionize
- auto updates
- fixing types and pane structures

## low level

- [ ] cpu on desktop gets pegged at 100%
- [ ] intercept all a=href and open in native browser (slack)
- [ ] slack emojis
- [ ] only close peek on esc if electron focused
- [ ] slack unread/read sql
- [ ] slack various formatting issues: backticks ``, inline html
- [ ] setting pane improvements
- [ ] double click to open OrbitCard item
- [ ] swindler on close window need to reposition
- [ ] explore mockup
- [ ] home animations
- [ ] productionize
- interaction
  - [ ] space to peek
    - appStore.hasNavigated = false on new query, true on keydown
    - use that to make space open peek
  - [ ] option+key to pin needs some bugfixing (~30m)
    - if opened/closed again, select text in header
    - fix option+backspace to pin/delete
- settings/onboard
  - on no bits, show onboard/settings stuff
  - general settings stuff at top of settings pane
    - adjust delay for option hold
    - adjust max storage size
  - automatic settings: slack common rooms, etc
  - remove setting + clear bits
- peek
  - design
    - open/close interactions
  - [ ] click header input clear peek
  - [ ] peek auto link links
  - [ ] peek show images
  - [ ] gmail formatting issues (apostrophe's are html escaped)
- profiles
  - [ ] sync people info from github
  - [ ] sync people info from google
  - [ ] peek view with aggregate info
  - [ ] NLP: related things, common rooms
- sync
  - [ ] deletes! needs to sync when something deletes :/
  - [ ] github sync
  - [ ] github simple sidebar/peek
- stack
  - [ ] fix electron devtools not working

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
