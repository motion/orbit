NEXT

- move quickly towards a working All/People/Terms pane in one window
- home should show a column of each of them
- clicking the currently active pane should toggle it open/closed
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

- daily digest
  - summarized recent activity using your topics
- micro polls app:
  - can create a poll
  - shows in a dropdown
  - anyone can quickly vote on it
- question and answer app:
  - can create a question
  - anyone can post answers on it
- database explorer app:
  - can enter a local path for a database
  - shows the database in a virtual table
  - lets you write sql queries in the topbar
  - lets you insert common sql queries in sidebar
- announcements list:
  - can automatically have it query for emails from "announcements@company.com"
  - have it show a banner if new announcement

# App API

import { Button } from 'orbit/ui'
import { Language } from 'orbit/engines'
