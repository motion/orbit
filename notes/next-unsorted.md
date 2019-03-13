Stack-level improvements

- Make Actions/Effects better organized
- Make Actions able to be used from REPL for many cases

---

- cloud stuff:
  - store teams/accounts in cloud
    - no data just the config for it and identifiers
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
- const [key, setKey] = useSetting('key')
  - easy way to be able to have a new UI-related query/update on setting

for me once split out:

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

- WITH website:
  - use it to recruit developers
    - heavily target people who have built big electron apps:
      - VSCode, Atom, Airtable, Slack
  - reply to gwern:
    - send him the website + a few cool demo videos and a little explanation

big projects

- new site:
  - from scratch navigation, react-spring, nicer responsive, make it good step by step
- memory:
  - initial app with the prompt to allow for accessibility
  - getting OCR integrated and begin having it auto scan and store in memory
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
