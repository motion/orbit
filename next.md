## broadly

* fake hardcoded demo features (3 days)
* explore ui (1 day)
* people directory (1 day)
* highlight words (2 days)
* working syncers/settings (2 days)
* profiles (1 day)

## now

* profiles design iteration
* have the cards show _why_ they are there
* topics you follow dropdown
* fix settings
* tear away peeks + super simple app
* get dark blue theme working for news area
  * work on themes
* pinning item to top of news for a day
* bring back highlight words harcode demo

demo for Formidable on May 12th:

* contextual/OCR related content
  * be sure we can enable it and run it on a page easily
  * come up with a simple highlight words design that shows it
* finish profiles with better design
  * includes moving between them
  * should aggregate even if faked from multiple sources
* bring back tear away peeks to demonstrate apps
* simple demo of coding an app and deploying it, mostly hardcoded but working
  * need to figure this out, but honestly just showing the ease of code => deploy and syntax is big
  * hmr is cool here too
* simple app we built showing a chart that tears away and stays on screen
* ensure settings panes generally work so we can show it quickly
* building a general walkthrough of demo and plan for pitching the various pieces
  * can just be our content, they dont care about it being fake just as long as it works and has right features
* better theme and style polish all around

* reach goals for demo
  * make "@" show a list of slack people + search people
    * solidifies the company directory feel
  * make the "Home" button show hardcoded active projects and recent activity summary of each
  * maybe: color themes for ocr/context (if can do in 1 day)
    * think this is actually big because shows how nice the system is for deploying to your team
    * this + news + ocr, really solidifies defensibility x how we are trustworthy for executing well in future

deploying beta for company like formidable (est dev time: 3m)

* Merged cosal daily summaries
* Basic version of app creation deployable
* Basic p2p or slack based sync system for simple curation of intranet content
* Basic project collation logic
* finish: search, peek, profile, syncers, polish, productionize
* maybe: simple or toggleable OCR/context bar

--- me

* peek needs a "pin" button like orbit context
  * then make esc clear peek always, even not mouseover
* clear peek on scroll
* [ ] intercept all a=href and open in native browser (slack)
* [ ] themes or surfaces really need well thought lighten/darken functionality
* [ ] slack emojis
* [ ] only close peek on esc if electron focused
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

  * [ ] get builds working to .app
  * [ ] get auto update working
  * [ ] minimize builds to smaller size
  * [ ] see if can share chromium or delay download
  * [ ] check small screen, big screen, change screens

* research

  * [ ] keeping chromium warm

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

sync / simple explore/curation architecture (~2-3weeks)

* "pin result" feature for search
* simple explore manager
* could be help onboarding so everoyne doesn't need to reconfigure things
* "create grouping" for wiki/explore
* "define team"
* "mark stale" etc
* could even have it generate a wiki on-prem
