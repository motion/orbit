NEXT

1. Create apps distribute via p2p
2. Home redesign for apps:
   - Big masonry cards that show some sort of topic overview, stats
   - Slack card for example shows recent topics and recent popular rooms
   - Then hover/click the Slack card and see:
     - A trending topic explorer:
     - Left sidebar has rooms
     - Right side shows recently active people + topics
     - Click a topic and it opens a tab in that app
       - that tab shows a list of conversations filtered by that topic
   - Other apps can basically actually show the same thing to start
     - TODO ideate on coolest way
3. AppleScript 2.0:
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

- all done, closing... better screen
- "stop asking" and "always send" for error reporting
- "reset orbit db" option if error during startup
- show current app name in Orbit <Tray />
  - can use bounds in https://electronjs.org/docs/api/tray
    - click on icon shows menu
    - click on words shows/hides orbit
- cosal engine
  - person profile summaries
  - bit and person relevancy
  - cosal indexing
- memory
  - once it scans a few times make it store a Bit
- record video of a demo
- community - beta build, email, rss updates in app

- refactor: bring `orbit-electron` into `orbit`
  - clean up the child process fork stuff a tiny bit
  - cleans up a lot of duplicate packages

# Umed

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
