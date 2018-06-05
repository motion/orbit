# next

* product sprint for 3 weeks
  * need to flesh out stripe home completely for demo
  * goal is make home header have a slick video
* also need to write three articles from write.md
* then:
  * 1 week
    * update site with video intro
    * update site with blog posts
    * polish everything to better explain (features use cases)
    * post articles to HN, PH, dev twitter, etc

# website

* fossa/expensify logo/quote
* Blog - one post: noise or customer success
* company logos (after sending to people)

# dev

* some small explore page improvements
* fix directory showing profile card
* hmr dehydrate/hydrate
* types for .provide, .attach, and view()
* think through guru flux competitor
* tear away peeks + super simple app
* pinning item to top of news for a day
* custom apps
* Merged cosal daily summaries
* Basic p2p or slack based sync system for simple curation of intranet content
* Basic project collation logic
* finish: search, peek, profile, syncers, polish, productionize
* maybe: simple or toggleable OCR/context bar

--- me

* [ ] intercept all a=href and open in native browser (slack)
* [ ] slack emojis
* [ ] only close peek on esc if electron focused
* [ ] slack unread/read sql
* [ ] slack various formatting issues: backticks ``, inline html
* [ ] setting pane improvements
* [ ] double click to open OrbitCard item
* [ ] swindler on close window need to reposition
* [ ] explore mockup
* [ ] home animations
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

* sidebar

  * [ ] click to link to the Bit
  * [ ] list: movement + animations + keyboard/scroll select orbit list

* peek

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

sync / simple explore/curation architecture (~2-3weeks)

* "pin result" feature for search
* simple explore manager
* could be help onboarding so everoyne doesn't need to reconfigure things
* "create grouping" for wiki/explore
* "define team"
* "mark stale" etc
* could even have it generate a wiki on-prem
