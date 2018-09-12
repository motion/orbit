# nate

- Monday -- _finish great "app" demo_
  - Make demo app nicer:
    - Sidebar selectable list items
    - Working tabs
    - Better table contents
- Tuesday -- _make app work better for demo_
  - double app icon bug
  - on focus away from orbit hide it (use old code for activate)
  - scroll down should keep search at top
- Wednesday -- _profiles_
  - cosal attempt get it running and analyze for use in profiles
  - design run on the person feed
  - filter/sub-search for the feed
  - pagination for the feed
- Thursday -- _onboarding_
  - revisit the site and get it running, fix up
  - we'll do in-app account system dont bother doing it on site
  - have a permanent download link to use
  - fix spaces / screen resize bugs
- Friday -- _have demo video / productionize_
  - goal today is to make demo really shine
  - lots of performance, interaction, etc
  - record video a few times to get through full demo
  - compose email for mailing list in tandem

# Umed

- Goal by end of week:

  - Really focused finish on observe/throttle fix (ideally no more than a day)
  - Fix a ton of syncers stuff
  - Clear you up so next week we can start on new stuff

- Runthrough on syncers:

  - See trello for important ones
  - Slack select all rooms by default (syncer needs to respect settings/set them)
    - Same with github
  - Gmail how do I know if its html or text?
  - Gmail super slow
  - Gmail no html coming back?
  - Really simple throttle to keep cpu from going too much
  - Auto sync more by default: everything should just "sync" a lot when you add it (default whitelist a lot)
    - for gmail, dont sync full history, but do sync a trailing X months or limited # of items
  - PersonBit query recent + limit
  - Slack.people sometimes still not showing up
  - Github sync auto select everything by default
  - GDocs auto sync most things by default

- Next week:
  - Add simple RSS Syncer
    - Values can have feed urls
  - fts5 integration

# Nate

- Multi-process app demo
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

## Website signup for beta

- Signup process
- Account manage area
- Secure source code
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

# next

- test if we dont need cloud oauth https://laravel.com/docs/5.6/valet#securing-sites
- website docs https://github.com/gatsbyjs/gatsby/tree/master/www/src/pages
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
- doesnt follow monitor on add new monitor
- community
  - need a way for people to suggest/vote features
- semi-hide orbit while oauth open so it doesnt cover it
- better show the panes on onboard
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
