until end of jan:

- manage space pane
  - upload your image / name it / CRUD
- manage account pane
  - same sort of deal... + link to slack

* fix list heights: in orbit app they should be fixed to the parent height not content height
  - make option: fixToChildren and the default it fixes to parent

fix tab drag index
new app pane
command+enter to pop out app into own window / multi apps
actions menu

1. add people to search
2. fixing tray/menu display and interaction
3. movement: move selection into main pane would be helpful for scrolling emails + fixing action commands, tab should move from the main search input to the "create" action in lists apps
4. restore menus a bit just actions dropdown + search
5. get ocr hooked into menu enable/disable and output results
6. get ocr => memory simple list
7. work through lists apps a bit

---

sorting by prepping to split out work as best possible:

- figure out account management
  - need some way to sync
  - have to beat this:
    - you get your own account via just email
    - once you enter email and add ONE integration, we can link them
    - perhaps just limit to slack/google first
    - that way we can store email + integration for next time you sign in
    - then we can provide a way to invite your teammates down the road
  - allow teammates option from your master to "join" the space automatically
  - give an invite code to the first person

# employee

tasks:

- add the props type to useStore
- loadOne/observeOne commands are being resolved by both syncers and desktop from client calls
  - this should just go from client => desktop right?
- settings panes
  - run over and fix them, a lot of breaking things like github not loading repos
  - can add "enter" key shortcut to toggle selection in table
- syncers
  - on process exit it should clear all processing Jobs
  - github syncer and drive syncer not showing anything in their setting pane
  - syncers arent running after first adding them
  - crawler doesn't seem to handle links in slack for me, it was timing out / not syncing
    - perhaps we need better checks for that
  - syncers arent streaming or something weird is happening
  - github smart sync shouldn't sync everything, just recent stuff
  - got an out of memory issue during multiple syncs:
    - command:setting-force-sync:gmail:3 updating last cursor in settings {cursor: "11381717841944942365"}
  - compression:
    - needs to just do a sweep like a garbage collector:
      - have concept of "full" vs "compressed" sync state for bits
      - if an integration is taking more space, move from full => compressed
    - needs concept of "hydrate" endpoint
      - this can be shared between the syncers and the frontend (command)
      - if a bit is "compressed", then it can call "hydrate" on the frontend to fetch full info
      - these endpoints would need some rate limit logic (later)
- debug why gdrive syncer items show "empty" in frontend and clean that view up
- gmail syncer bodies are getting cut off early when they are just text, for example i see one where it just shows the first two sentences but nothing else
- issue with reporting errors in observable queries, they are unhandled/not sent upwards
  - "Desktop: Possibly Unhandled Rejection: Wrong arguments supplied. You must provide valid options to findOne method."
  - "at EntityManager.findOne (/Users/nw/projects/motion/orbit/app/orbit-desktop/node_modules/typeorm/entity-manager/EntityManager.js:449:16)
    at /Users/nw/projects/motion/orbit/app/orbit-desktop/src/observer/QueryObserver.ts:78:45
    at new Subscription"
- search
  - we should test search quite a bit more
    - have it do exact full searches first and then work down
    - so "full name" matches something with both words closer than "full" and "name"
- app store:
  - make it so we have servers to host them
  - make it so you can search them and install new ones
  - make it so you can deploy new ones to our servers
    - needs some interface inside the app to help manage it
- beta stuff:
  - signup with your email on the website
  - invite generation + validation in the app
- make it much easier to create apps / have them in their own area
  - with their own data they can easily hook into
- syncers bugfixing and improving performance and data storage
- memory as a source
- const [key, setKey] = useSetting('key')
  - easy way to be able to have a new UI-related query/update on setting
- back button:
  - simple simple version:
    - store a log of searches and pane switches:
      - appid of the pane
      - text content of search
    - be sure to debounce the search log entry quite a bit
    - then on back just look at entry and either set input or pane...
      - should be good enough for most use cases
    - next step would be selected item inside, but thats already way more complex

for me once split out:

- search interaction with other apps
- people with topics
- memory app or some idea of how to make it work
- topics as a source / topics apps generally

next steps:

- release

  - focus on a release that really hammers in the differences:
    - syncs a lot of stuff
    - search works well
    - memory starts to work
    - need to start on New App pane and custom search/list panes
    - need to get topic source working
  - do a simple website that focuses on the blog
    - like https://fibery.io/
    - start writing on blog about development progress next month

- apps
  - search
    - can adjust filters
    - we need more flexible filter adding system...
  - list
    - lets you add/sort eventually group
  - autolist
    - just takes items from a source
  - list-group

* reply to gwern:

  - finish a nice search demo
  - cleanup people a bit
  - cleanup vocab a little
  - get tray working a little
  - show history/memory a little
  - cleanup the orbit dropbox doc
  - send over to him short video and explanation

* get to value
  - get tray working
  - get basic lists app in place again
  - get tray actions menu
  - get ocr integrated with memory (memory app?)
  - iterate 10x

thinking through the lense of apps:

- can do it now without being "custom" just "customizable"
- can click to add a tab
  - give it name/icon
  - sort the tabs perhaps
  - choose settings for it during creation, every app can have a setting pane it defines
- i think the big helpful app is a sort of organizer
  - basically bookmarks + simple notes perhaps
  - it would have a search that integrates with it so you can search and then drag into the organizer
    - maybe search comes in once you type
    - alternatively:
      - search is the main app, but you can hit "actions" within any item
        - actions shows actions for any app that defines them
        - so you can say "pin to..." and then that pops up a modal
- now we can basically think of the apps as:
  - home = organizer with some defaults selected
  - people = search with a preset data source: People
  - vocabulary = list with a preset data source: Topics, Terms
- this gives you a ton of control out of the gate and gets to usability
  - you can set up multiple lists as you want
  - easy for companies to start organizing various things they want, perhaps, needs thought

ideas:

- contextual actions are really powerful
- being able to clip your current context to a specific app is really big
  - imagine clipping the current screen, or selecting some text, or current website to somewhere
    - you can put it in a list
    - or imagine an RSS reading app, can put it into your feeds...
    - or with people app, send it to someone
- this really gets into the centralizing force aspect:
  - because it can be the "in-between" from data/apps to your current context, it has vast power
    - save it for later, reading, organizing all can work through this

get to value....

- just cleanup the app a lot so its generally working
- lots of small interaction and polish and low level fixes will setup for a good year
- simplify search so its non-grouped and features sort of work
- consider a better organizer feature - lists or collections or whatever
  - it basically can be the "home/search" app as searching inside it will be what you use to pin to various areas
  - journal-like essentially
  - can put people into lists if this works well
  - folders could be an option as it would then really work as bookmarks
  - people can be a search app filtered to people?
- vocabulary can then just be a collection app?
  - probably not necessary, but worth thinking about
- begin through design of creating new apps
  - filtered search
  - manual list
  - eventually custom app
- upgrade the menus for new design
  - action menu
  - contextual search
  - contextual people
- finally, augmented stuff
  - get it so its inserting from memory
  - filter by memory in search
  - get filters in search nicer

strategically step by step:

- website (~2-3 weeks):
  - on vacation / ending of december: build out the new site to utmost quality
- WITH website:
  - use it to recruit a developer
    - heavily target people who have built big electron apps:
      - VSCode, Atom, Airtable, Slack
  - reply to gwern:
    - send him the website + a few cool demo videos and a little explanation
- demo (~4 weeks):
  - generally polish apps and current bugs + maybe dark theme
  - fix tray and get it working a bit better
  - initial steps for Memory app pane showing recent items
- WITH demo AND website:
  - continue to recruit
  - follow up with Ted, Andy
  - post to facebook looking for co-founder
- beta (~4 weeks):
  - getting terms app working properly
  - involves quite a bit of polish to syncers, various fine detail
  - building to production
  - some better memory features most likely
- WITH beta:
  - write a new blog post to announce updates and send to mailing list
  - send to facebook
- launch (~4-12 weeks):
  - quite a bit of cleaning, refactoring and polish, and fleshing out things
  - finishing search, topics, people, upgrades
  - do the big app split out so we can figure out a variety of things around there
  - cloud server for registration and inviting team
  - viral / inviting based features
  - get some of the highlighting features working

big projects

- new site:
  - from scratch navigation, react-spring, nicer responsive, make it good step by step
- app data storage:
  - generic way to have apps store and manage data, better views for editing
- app separation into own package:
  - allows for custom apps
  - helps with serverless style functions you can create to insert and manage data easily (terms app)
- memory:
  - initial app with the prompt to allow for accessibility
  - getting OCR integrated and begin having it auto scan and store in memory
- search:
  - get it searching all types of bits, finish grouping or remove, fix keynav
  - potentially move PersonBit into just a regular bit with type: 'person'
- dark theme
- tray:
  - potentially make the tray not show all the apps and just show search
    - and then make it also have a contextual action dropdown that integrates with Context
- terms:
  - fix topics, add a lot more and have them show in profiles
  - once app data is in place have it so it scans every so often and updates trending terms
- highlights:
  - once terms are in place
  - focus on high performance highlights of people/terms
  - then upgrade and fix up the floating apps
- app store:
  - once clouds in place and apps are in place start on store

high level to launch:

- make 3 apps work nicely
- make settings/sources/onboards work nicely
- wide variety of polish on ux / interaction
- fix/change tray so its useful/fun
- improving relevancy and topics
- a server for signup, syncing data between people
- building the website
- take a good look at what it would take to allow custom apps

low level next:

- move quickly towards a working All/People/Terms pane in one window
- improve the creation panes generally
- clicking the currently active pane should toggle it open/closed
- get dark theme working
- get a lot of interaction working
- big settings pane cleanup, restructure
- fix search up a lot
- fix people and have it add in topics/terms into their data object
- make the terms app actually work and mockup some adding/editing
- remove search from contextual apps showing by default and make it show context
- onboarding for sources
- onboarding for account creation
- improving and fixing all the bit views
- grouped search main view work
- adding in all sorts of fundamental help -- links to thinks, etc
- https://libp2p.io/

dev-tool level:

- make stores automatically get all stores from context somehow or able to DI them
  - if we do a DI system we can DI props + DI observable props configurably

Tray:

- movement and pinning logic for typing, option+type
- option to turn off option+peek
- add auto select on search first item
- Orbit search results context menu opens by default (not show last one)
- contextual search app only shows individual items

---

apps v2

search:

- making contextual search work with OCR
- fixing contextual search display
- fixing integration filters in ui
- drag/drop support of items (easy using electron drag drop api)
- grouped search app main view

---

Contextual stuff is high on this list:

- Showing current app in a context popover
- Letting you pin context into lists
- Letting you send context to people
- Searching your recently viewed items

- Having the right topic/ocr API structure
- Showing them in context
- Augmented
- Integrated easy dev experience

- people syncers: if slack is added, use that as source of truth and only add other people "on top"

  - no need for people from every integration, but do need to figure out if its the "same person from slack"
  - add an option to set "source of truth" setting in settings panes

- small things to do:

  - make search items drag/drop their links: https://electronjs.org/docs/tutorial/native-file-drag-drop
  - github view: fix not showing comments content
  - github view: fix can't select text with mouse
  - drag and drop items from menu: https://electronjs.org/docs/tutorial/native-file-drag-drop

- Team account management and onboarding flow

  - Create a server and database system that is good for handling signups
  - We need frontend for signup/login/email flows
  - Create space
  - Sync just configuration data from Space

* "smart sync"

  - part 1, "index as you search":
    - we sync as much as we can, but avoid filling hard drive too much (for all syncers)
    - we have a separate direct search endpoint though for every integration
      - so for drive we have something like POST `/api/drive/search?q=${query}`
    - when you search we debounce heavily (about 1s) and then hit these endpoints
    - we then scan the "topmost" few bits from each endpoint and slide in a "extra results" drawer at the bottom of the search results list
      - that way it doesn't disrupt the current results at all, but you can still see it
      - we scan these items in automatically for "next" searches
    - we should cache these smart syncs so we don't keep "redoing" them, just every so often per-search-term
  - part 2, "garbage cleaning"
    - we want an idea of unimportant things
    - we store every search you type in (again debounce by a bit)
    - we determine what you care about:
      - we use:
        - all your searches as a high weight
        - all your recent bits (onces produced by you)
    - every so often we do a "garbage clean" (if we are near size limits):
      - we take the oldest items from each integration
      - we use the "what you care about" set of items + cosal to do similarity
      - this can be adjusted in a few ways as well (for last 100 search terms do direct search too)
      - we can also use the global bit set to find "interesting things to company recently"
      - and then we run over the old items and clean them
      - this can basically be "score" based, where we come up with a scoring function that takes in recentness, interestingness-to-me, and interestingness-to-everything-in-this-space

# ideas for apps

- questions and answers (stackoverflow):
  - can create a question
  - anyone can post answers on it
- polls:
  - can create a poll
  - shows in a dropdown
  - anyone can quickly vote on it
- announcements
  - can automatically have it query for emails from "announcements@company.com"
  - have it show a banner if new announcement
- company newspaper
  - fancier announcements
  - using some ML for title generation
  - using some ML for trending topic modeling
- daily digest
  - summarized recent activity using your topics
- generic database explorer app
  - can enter a local path for a database
  - shows the database in a virtual table
  - lets you write sql queries in the topbar
  - lets you insert common sql queries in sidebar

# App API

import { Button } from 'orbit/ui'
import { Language } from 'orbit/engines'
