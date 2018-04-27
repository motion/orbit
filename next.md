## now

* [x] prevent option tap from clearing docked sidebar
* [x] peek view for slack convo
* [x] nice design
* [x] related things design
* [x] related things hardcode different types

* [x] highlighted item index
* [x] expanding on highlight
* [ ] highlight top items
* [ ] fake peek for top items

* [ ] peek carousel show people + docs
* [ ] peek view click between items fixes
* [ ] peek view click between history + back button
* [ ] fix new bug with cmd+space showing in context before showing sidebar
* [ ] split sidebar from context sidebar
* [ ] more home design
* [ ] nicer avatar/meta news

--- idea

* [ ] match color to the app

--- demo

* [ ] think through news / design
* [ ] reach: mockup opening news item
* [ ] slack attachments/images/emojis

* [ ] only close peek on esc if electron focused
* [ ] focus electron on mouseover peek
* [ ] interaction finish bugs
* [ ] search jitter
* [ ] fix keyboard movement bugs
* [ ] slack unread/read sql
* [ ] slack various formatting issues: backticks ``, inline html
* [ ] setting pane improvements
* [ ] fix option hold not working sometimes after a delay, until you move cursor
* [ ] double click to open OrbitCard item
* [ ] swindler on close window need to reposition
* [ ] explore mockup
* [ ] home animations
* [ ] make "@" show a list of slack people + search people
* [ ] productionize

### sorted by area

* interaction

  * [ ] slightly faster orbit hide on mouseout
  * [ ] space to peek
    * appStore.hasNavigated = false on new query, true on keydown
    * use that to make space open peek
  * [ ] option+key to pin needs some bugfixing (~30m)
    * if opened/closed again, select text in header
    * fix option+backspace to pin/delete

* settings/onboard

  * on hide, go out of settings
  * on no bits, show onboard/settings stuff
  * general settings stuff at top of settings pane
    * adjust delay for option hold
    * adjust max storage size
  * automatic settings: slack common rooms, etc
  * remove setting + clear bits

* sidebar

  * [ ] overflow title flicker on expand
  * [ ] list: animations between active
  * [ ] better fill to height when not having many results
  * [ ] default view: your day -- how it shows various things, grouping, etc
    * [ ] upcoming, haven't seen

* slack

  * [ ] cosal keywords for convo

* design

  * OrbitCard
    * [ ] for icons - try result.integration + result.type first, fallback to result.int

* indicator

  * likely needs to be done as native osx if we want it
  * [ ] design

* smoothness

  * [ ] re-focus app after animation finish (when not holding option)

* sidebar

  * [ ] click to link to the Bit
  * [ ] slack: sync People, Chat Rooms
  * [ ] list: movement + animations + keyboard/scroll select orbit list
  * [ ] overdrive: deep investigate animate performance

* peek

  * horizontal carousel fixing
  * design
    * open/close interactions
  * [ ] click header input clear peek
  * [ ] peek auto link links
  * [ ] peek show images
  * [ ] gmail formatting issues (apostrophe's are html escaped)

* profiles

  * [ ] sync people info from github
  * [ ] sync people info from google
  * [ ] peek view with aggregate info
  * [ ] NLP: related things, common rooms

* sync

  * [ ] deletes! needs to sync when something deletes :/
  * [ ] github sync
  * [ ] github simple sidebar/peek

* stack

  * [ ] fix electron devtools not working

* productionize

  * [ ] get builds working to .app
  * [ ] get auto update working
  * [ ] minimize builds to smaller size
  * [ ] see if can share chromium or delay download
  * [ ] check small screen, big screen, change screens

* long tail polish

  * may want to fork electron to get better always-on-top functionality like Helium.app
    * would let us do better spotlight stuff
  * disable when super low battery
  * bridge both setState and receiveState should batch a tiny bit
    * if multiple setstate called before settimeout, group them
    * if multiple recevied before timeout, group them

* research

  * [ ] keeping chromium warm

## launch

* great daily summaries / trends (~3 months)
* ocr and contextual relevants/highlights + long tail fixes there (~1 month)
* finishing ux/peek/search interaction and features (~1 month)
* site, (2 months)
* video (~1 month)
* beta setup (1 week)

security (~3weeks)

* we likely either need to contract or get someone for this directly
* involved auditing entire codebase, probably doing a variety of https things
* encrypting a few pieces
* local oauth system needs some work probably (hardcodes keys locally now)

syncers (~4-5months)

* more stable, reliable, configurable with rich data
  * support deletions etc
* github
* jira
* asana
* confluence
* crawler
* dropbox/paper
* outlook
* arbitrary imap/email
* trello, etc...
* maybe some hr tools

rich people/teams/explore (2weeks-Infinity)

* automatic project collation and explore
* would provide a much more thorough value on launch if we have explore (feels full featured from day 1)
* smart linking together of people across different integrations
* smart team or "commonly works together features"

sync / simple explore/curation architecture (~2-3weeks)

* "pin result" feature for search
* simple explore manager
* could be help onboarding so everoyne doesn't need to reconfigure things
* "create grouping" for wiki/explore
* "define team"
* "mark stale" etc
* could even have it generate a wiki on-prem

improving existing features (1month-Infinity)

* explore better news interfaces and queries/metadata
* help interview and test app with various beta testers
* do tests of feature ideas for daily summaries
* longer tail search features that really make it powerful (filters, time span etc)
* scaling everything up to work on bigger data sets or filter them down better

beta to launch work (~1month)

* help building out various sections for website
* help coordinate finding good designer or video creators
* help reach out to get people into the beta
* help build beta site / mailing lists / chat rooms etc
  * various sub-pages and sections
  * pricing page + buying stuff

testing, polish, productioninizing (~2-3weeks)

* testing across multiple mac versions
* slimming bundle size
* improving various auto updates
* having a continuous integration process so we can deploy quickly
