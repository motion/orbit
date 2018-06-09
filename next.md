Questions for Daniel:

* How were you thinking of Cue as a startup at the end
  * your P/M research probably looks a lot like my own
* Types of companies you felt were best fit
* Reach outs to COO of mid-size tech company in SF ~500ppl seem good strategy?
* Getting feedback in many directions
* Building the right team
* Selling to apple (he wont like this question)
*

# next

* jonathan set up ticket

## demo

* home
  * show a github ticket
    * show the most recent action preview there
  * show a team card with inline update
  * peek conversation and "Pin to Team"
    * react-spring peek move
* search
  * slack:
    * list all links, then filter by room, then by person
    * list all attachments, see in grid
    * shows topic summarized convos nicely
  * topic search would be nice
  * "pin to search"
* directory
  * show profile
  * show team peek card
* apps

  * final wow
  * click "create app", paste in some code
  * realtime HMR edit
  * shows up in Home

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

* hire:
  * start with syncers + panes
    * do one syncer/pane at a time
    * google docs
    * google mail
    * slack

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
