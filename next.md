## next

* [x] swindler fix not updating on some window resize/change

### home/design

* filtering/exploring various integrations

## triage

* [ ] research into unread metadata from slack (read/unread especially)
* [ ] remove search jumpiness
* [ ] peek back button + history
* [ ] make "@" show a list of slack people + search people
* [ ] slack views: show attachments/images
* [ ] docked: have taller peeks

## areas

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

  * disable when super low battery
  * bridge both setState and receiveState should batch a tiny bit
    * if multiple setstate called before settimeout, group them
    * if multiple recevied before timeout, group them

* research

  * [ ] keeping chromium warm

## theoretical division of labor for first employee

sums up to about ~8 months of work. i'd estimate we still have at least another 16 months outside of this work.

big pieces _outside first employee_ would be:

* great daily summaries (~3 months)
* finishing ux/peek/search interaction and features (~2 months)
* likely refactors for final interface (~1 month)
* lots of time on site, beta, video (~4 months)
* ocr and contextual relevants/highlights (~2 months)
* algorithm improvements (~?1month)
* unknown unknowns and optimism (~4 months or ~20% of rest of work)

then _for employee_:

syncers (~1-2months)

* more stable, reliable, configurable with rich data
* github
* jira
* confluence
* maybe some hr tools
* maybe dropbox/paper
* maybe alternative email platforms

deep focus on interface smoothness (~1month)

* really nice animations for lists would go a long way but require pretty intense react work
* making an orbit indicator/highlight words probably needs slim native app interface
* upgrade to react 16.4 async/react may require building abstractions on top of mobx

rich people/teams/explore (2weeks-Infinity)

* would provide a much more thorough value on launch if we have explore (feels full featured from day 1)
* smart linking together of people across different integrations
* smart team or "commonly works together features"

simple curation architecture (~2-3weeks)

* "pin result" feature for search
* "create grouping" for wiki/explore
* "define team"
* "mark stale" etc
* could even have it generate a wiki on-prem

generally assisting with improving existing features (1month-Infinity)

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

tons of testing, polish, productioninizing (~2-3weeks)

* testing across multiple mac versions
* slimming bundle size
* improving various auto updates
* having a continuous integration process so we can deploy quickly

variety of stack improvements (~1month)

* improving typing and architecture in variety of sketchy areas
* optimizing performance in areas where its important
* adding checks and fixing bugs as we run into them, allowing us to focus more on design/research
* getting our hmr working on babel 7 would allow us to use typescript everywhere
  * means app and ui kit can be typed, much easier to work with
* could even help release a couple packages, getting us some PR and contributors to make our stack a bit safer long term
