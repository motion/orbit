## now

## triage

* beta sprint (~2 weeks, May 4)

  * could extend this to 4 weeks, but aim for 2 and re-assess
  * working: slack/mail, summary, search, generally work well

  * nate

    * design/feel
      * design home/news/summary/explore
      * interaction for summary/peeks
    * slack
      * read/unread metadata from slack in sortable sql form
      * better design for peek/move between related convos
      * better grouping of conversations
      * better selection of the right rooms to sync
      * finish setting pane nicely
      * show attachments/images
    * peek movement
      * clicking items in peek lets you move around
    * interaction/visual/bugs
      * generally make sure its not breaking/bugging
      * improve and make clear shortcuts
    * productionize
      * build to .app
      * slim it a bit so ~250mb not ~700
      * working oauth on fresh machine

  * nick

    * cosal
      * continue to test across various searches and improve until good
    * slack convo summary
      * various tweaks to filter weird words, combine words
      * test and iterate
    * daily summary
      * make model of seen things and find weights that are good
      * generate summary of non-seen things

### unsorted

* [ ] swindler on close window need to reposition
* [ ] ? filtering/exploring various integrations
* [ ] remove search jumpiness
* [ ] peek back button + history
* [ ] make "@" show a list of slack people + search people
* [ ] docked: have taller peeks

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

* profiles

  * [ ] sync people info from github
  * [ ] sync people info from google
  * [ ] peek view with aggregate info
  * [ ] NLP: related things, common rooms

* sync

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

* unknown unknowns and over-optimism (~3 months or ~15% of rest of work)
* great daily summaries / trends (~3 months)
* ocr and contextual relevants/highlights (~1 month)
* finishing ux/peek/search interaction and features (~2 months)
* site, beta, video (~4 months)
* algorithm improvements (~1month)
* deep focus on interface smoothness (~2weeks)
  * nice animations would go a long way but require pretty intense react work
  * making an orbit indicator/highlight words probably needs slim native app interface
  * upgrade to react 16.4 async/react may take a while (require abstractions on mobx even)
  * weve not done any real profiling

security (~~~2weeks)

* we likely either need to contract or get someone for this directly
* involved auditing entire codebase, probably doing a variety of https things
* encrypting a few pieces
* local oauth system needs some work probably (hardcodes keys locally now)

syncers (~1-2months)

* more stable, reliable, configurable with rich data
* github
* jira
* confluence
* maybe some hr tools
* maybe dropbox/paper
* maybe alternative email platforms

rich people/teams/explore (2weeks-Infinity)

* would provide a much more thorough value on launch if we have explore (feels full featured from day 1)
* smart linking together of people across different integrations
* smart team or "commonly works together features"

sync / simple curation architecture (~2-3weeks)

* p2p may be simpler, or necessary
* could be required for onboarding so everoyne doesn't need to reconfigure things
* "pin result" feature for search
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

attention (?)

* may be required for good trends
* may be really beneficial for what you've missed

stack improvements (~1month)

* improving typing and architecture in variety of sketchy areas
* optimizing performance in areas where its important
* adding checks and fixing bugs as we run into them, allowing us to focus more on design/research
* getting our hmr working on babel 7 would allow us to use typescript everywhere
  * means app and ui kit can be typed, much easier to work with
* could even help release a couple packages, getting us some PR and contributors to make our stack a bit safer long term
