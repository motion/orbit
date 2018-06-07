# next

* product sprint for 3 weeks
  * need to flesh out stripe home completely for demo
  * go for flash
  * goal is make home header have a slick video
  * show:
    * unifying integrations in settings
    * searching through stuff
    * summarized conversation
    * profile
    * possibly:
      * clip in new knowledge piece + posts to slack and google doc folder?
      * project overview rich card
      * pin to top of search
      * mark as stale
* write three articles from write.md
* site:
  * 1 week
    * fossa/expensify/??? logo/quote
    * update site with video intro
    * update site with blog posts
    * polish everything to better explain (features use cases)
    * post articles to HN, PH, dev twitter, etc
* start twitter and tweeting, follow a bunch of good and similar accounts
  * setup tweetbot or something to manage

# dev

## high level

* p2p sync system
* merging cosal
* major fixes for settings, syncers, etc
* productionize
* auto updates
* fixing types and pane structures

## low level

* [ ] cpu on desktop gets pegged at 100%
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
* interaction
  * [ ] slightly faster orbit hide on mouseout
  * [ ] space to peek
    * appStore.hasNavigated = false on new query, true on keydown
    * use that to make space open peek
  * [ ] option+key to pin needs some bugfixing (~30m)
    * if opened/closed again, select text in header
    * fix option+backspace to pin/delete
* settings/onboard
  * on no bits, show onboard/settings stuff
  * general settings stuff at top of settings pane
    * adjust delay for option hold
    * adjust max storage size
  * automatic settings: slack common rooms, etc
  * remove setting + clear bits
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
