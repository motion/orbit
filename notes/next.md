# nate

- "stop asking" and "always send" for error reporting
- "reset orbit db" option if error during startup
- add report recent error log in Tray
- show current app name in Orbit <Tray />
  - can use bounds in https://electronjs.org/docs/api/tray
    - click on icon shows menu
    - click on words shows/hides orbit
- make it great
  - Spin orbit <Orb /> when scanning
  - Tooltip on <Orb />
- cosal engine
  - person profile summaries
  - bit and person relevancy
  - cosal indexing
- memory
  - once it scans a few times make it store a Bit
- record video of a demo
- saved searches on home
- community - beta build, email, rss updates in app

- refactor: bring `orbit-electron` into `orbit`
  - clean up the child process fork stuff a tiny bit
  - cleans up a lot of duplicate packages

# Umed

- Slack select all rooms by default (syncer needs to respect settings/set them)
  - Same with github
- Really simple throttle to keep cpu from going too much
- Auto sync more by default: everything should just "sync" a lot when you add it (default whitelist a lot)
  - for gmail, dont sync full history, but do sync a trailing X months or limited # of items
- PersonBit query recent + limit
- Slack.people sometimes still not showing up
- Github sync auto select everything by default
- GDocs auto sync most things by default

# small

- p2p libs: https://news.ycombinator.com/item?id=18077312 https://github.com/libp2p/js-libp2p
- could open a special link type: orbit://gD7sadhgasdy78aDT7
- test if we dont need cloud oauth https://laravel.com/docs/5.6/valet#securing-sites
- website docs https://github.com/pedronauck/docz https://github.com/gatsbyjs/gatsby/tree/master/www/src/pages
- Location as a model
  - This way we can search + generate feeds by Location
- survey notification if they use it for a few days...
- manage people (may not want github for example to sync in people)
  - probably by default some integrations are "additive only"
  - so they only sync in on top of existing people
  - also could scan contacts
- multiselect tables keyboard nav not working:
  - generally inner app keyboard nav not working
- showing sync status:
  - make a SyncStatusStore that takes a setting
  - ask umed: how to get all JobRepository.Syncer types
  - in Setting panes show status at bottom or top
- typing while focused on a peek:
  - reset index to 0 not -1, keeps the peek open as you filter things
- semi-hide orbit while oauth open so it doesnt cover it
- after onboard "what can i do / search?"
- typeform survey to capture a few potential paths
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
- react-spring for peek placement
- hoverGlow needs fix for x/left just like top/y
- @mcro/color: increaseContrast, decreaseContrast
- UI.Text not wrapping subtitlePrefix
- hmr: doesn't store.unmount stores often
- react: await finishRender() could be interesting
