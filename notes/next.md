- make blog download link go to a new page that has download button
  - make it say it sends analytics back on crashes and usage so we can track beta usage
  - add sentry analytics

NEXT

1. OCR search demo with cosal
2. Create apps distribute via p2p
3. Home redesign for apps:
4. Apps + Person have a new app design like the demo app:
   1. Sidebar shows their top topics
   2. Main view has Locations in tabs
   3. Main view shows topic \* location bits for that person
5. AppleScript 2.0:
   - Ridiculously easy to build apps
   - Pundle power built right into Orbit
   - Apps have two views:
     - Main and Peek
     - Main is the big app on homescreen
     - Peek is the one you see from searches
   - Apps can Sync
   - Apps have Triggers
   - Apps have cool APIs:
     - NLP (words, relevancy, search)
     - Triggers:
       - Words
       - Concepts
       - URLs/App state

# nate

- search results peeks:
  - hover to show
  - design
    - bigger font
    - less clutter
    - no header
    - simple topic list
- all done, closing... better screen
- "stop asking" and "always send" for error reporting
- "reset orbit db" option if error during startup
- record video of a demo
- community - beta build, email, rss updates in app

- refactor: bring `orbit-electron` into `orbit`
  - clean up the child process fork stuff a tiny bit
  - cleans up a lot of duplicate packages

# Umed

- remove "archived" gmail
- Really simple throttle to keep cpu from going too much
- Auto sync more by default: everything should just "sync" a lot when you add it (default whitelist a lot)
  - for gmail, dont sync full history, but do sync a trailing X months or limited # of items
- Slack.people sometimes still not showing up
- Github sync auto select everything by default
- GDocs auto sync most things by default

# next

- p2p libs: https://news.ycombinator.com/item?id=18077312 https://github.com/libp2p/js-libp2p
- could open a special link type: orbit://gD7sadhgasdy78aDT7
- test if we dont need cloud oauth https://laravel.com/docs/5.6/valet#securing-sites
- website docs https://github.com/pedronauck/docz https://github.com/gatsbyjs/gatsby/tree/master/www/src/pages
- Location as a model
  - This way we can search + generate feeds by Location
- manage people (may not want github for example to sync in people)
  - probably by default some integrations are "additive only"
  - so they only sync in on top of existing people
  - also could scan contacts
- typing while focused on a peek:
  - reset index to 0 not -1, keeps the peek open as you filter things
- clicking location buttons should filter that location
- clicking a name should search that name
- find by type (file / link is helpful)
- search results date strategy:
  - do separators based on time periods:
  - do by day for first week within the current month
  - do by month after that
- Fix empty profiles from gmail contacts import
  - Toggle select all button in table view
- fix highlight index click interaction
- fix integration buttons styling and going inactive after click
- cmd+z undo in search area (needs to work with toggles...)
- peek arrow position shouldn't straddle weird borders
- hoverGlow needs fix for x/left just like top/y
- @mcro/color: increaseContrast, decreaseContrast
- hmr: doesn't store.unmount stores often
