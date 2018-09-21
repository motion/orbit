# nate

- simple ocr would be killer demo
- simple /cosal endpoint for now
  - plus simple Cosal store that hits the endpoint
  - plug it into profiles
- Cosal.relevancy /relevancy endpoint
  - plug it into Bit
  - also make Bit views a bit bigger and nicer design
- write intro email 2 hours (medium post, nice screenshots + embedded video)
- record video of a demo

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

- Next week:
  - tfidf or cosal system
  - fts5 integration

# Nate

- Pane model + default Pane.id = 0, Pane.name = 'Home'
- Pane.feedOrder
- Pane.hasMany Feed
  - Feed.type: 'carousel' | 'grid' | 'list'
- rename feed UI
- add Feed from search UI
- show apps in QuickResults so you can add an app to home Feed
- Cosal merge, search and people profiles
- searchresults - keep scroll at top of pane makes it possible to move quickly down
- Move settings over to window
  - General, Appearance
- Documentation for onboarding
- Questionaire

# September:

- Rate limits may be per-token so we may not need fancy p2p stuff (or not yet)
- Community
  - Start community
    - Get a first beta build cut
      - Iron out a lot of bugs and syncer issues
      - Cosal early integration for search/profiles, maybe hstf5
      - RSS Syncer
    - Start Orbit friends chat
    - Typeform survey
    - Orbit home has RSS that has Orbit Updates + Orbit Helpsear
      - Updates are latest dev notes
      - Help is for onboarding onto Orbit, shows its power
      - Make the default home screen be "Orbit Updates"
      - Twitter as well, we can IFTT our twitter into rss
- Account system
  - This should let people set up an Orbit and share the config with friends
- Hire
  - Find someone to work on the swift OCR system

# next

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
- community
  - need a way for people to suggest/vote features
- semi-hide orbit while oauth open so it doesnt cover it
- after onboard "what can i do / search?"
- typeform survey to capture a few potential paths
- location filters: `.find({ location: { name: "..." } })`
- in:x for location
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
- Able to make your own "Pages/Spaces/Homescreens"
  - By default it splits them by Location in a new Pane for each App
  - We can also have an example of Design blogs example
- Get the basic app store in place
- If Swift contractor works out integrate some OCR
- Prep website for private beta launch

---

- cmd+z undo in search area (needs to work with toggles...)
- peek arrow position shouldn't straddle weird borders
- react-spring for peek placement
- hoverGlow needs fix for x/left just like top/y
- @mcro/color: increaseContrast, decreaseContrast
- UI.Text not wrapping subtitlePrefix
- hmr: doesn't store.unmount stores often
- react: await finishRender() could be interesting
