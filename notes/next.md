# actual be useful/fun/10x better at exploration

- home redo:
  - top carousel of "categories"
    - "Recent Interactions"
    - "My Topics"
    - ...locations/people sorted by most recently interacted
  - this lets us "default select" the first one without there being a peek
  - which means you can pop open orbit and then tab through them easily
  - also, since that is the same as "quick results"
    - typing filters it and can unify quick filters now nicely
    - "gm" filters the gmail carousel item
      - that then shows condensed recent gmail items
  - then below the carousel, show that "result set"
    - this can basically be search, so they are actually the same thing now
    - just empty search
    - could explore having a search option for "split by location", "split by topic"
      - that would bring back the old "list of carousels" option
- top bar in search is actual a "filter by" by
  - topics, recent people youve interacted with
- condensed search view by default
- recent items by default in search (weighted much higher)

* some slack messages empty
  - no messagetext/bit ({"user":"U0K6FMG5R","text":"","time":1539916580000})

- get "gm" to show recent gmail instantly

umed:

- get crawler to use chromium in electron so we can release it

- beginnings of building good search

  - build up dataset

    - join a bunch of slack rooms publicly available
      - https://www.google.com/search?q=public+developer+slack+rooms&oq=public+developer+slack+rooms&aqs=chrome..69i57.3105j0j1&sourceid=chrome&ie=UTF-8
    - add as many as you possible can
    - also just add a TON of github repos actually...
    - lets try and get some serious size, like 5GB of data or so
    - you can then just export your settings config and send to me so i can use them too

  - build up tests

    - lets make a special search-test package
    - gather test queries
      - scroll through certain slack rooms / github repos and try and find unique examples of queries you'd expect to find things
      - and then basically store the ID of the bit and the query you'd like to find it
      - build up about 50 of these across all these different integrations
    - create a test script
      - the script can just give us a "score" which is just how "high up" those results return for each query.

- fts search

  - basically just use a few queries and get fts working, then integrate with SearchResultsCommand

- rss syncer also can it be super easy to add?

  - maybe orbit can detect links
  - or you can paste into the searchbar to subscribe

- folder syncer:

  - can we pull it off without insane complexity?
  - smart sync could handle this

- "smart sync"

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

make search actually good

high level:

focus on what we can make really a big improvement in day to day first:

# Project Fluidity

- auto open peeks, better peek display, better search results display

  - GROUP together conversations in search results by much bigger amounts
    - and then in peek windows you can see them all together
    - join together ALL slack conversations that match your query in the results window into infinite scroll!!!!!
      - that way you can search one thing, see slack, hit results
      - also would let you group together slack things much more easily
  - GOAL: be able to try a couple things and find recent stuff almost always
  - more condensed gmail style view for conversations in search results
  - profiles
    - link people together better across integrations
    - rethink them and design using topics and higher level summaries
    - integrate them better into search results

- make keyboard and everything smooth and fast with no jitter

# Project Results

- fine tune the plain sql searches quite a bit
- fix various bugs in filtering and searching
- enable fts5 and integrate with filtering system
- get cosal better integrated and design data set to test its capabilities

# Project BugBusters

- lots of sync stuff, space saving, smarter sync startegies, etc

## in depth...

- cosal
  - play around more with cosal, figure out if we can do any interesting relevancy
  - put some UX together with nice peek windows to do relevancy with things
- look into better topic based search / high level search

  - generate topics in desktop - show them in quickresults?

- location as a model
  - lets us query locations for sub-searches

## profiles beta:

- quick actions: talk in slack, send email
- bigger, beautiful overview design

# next / ideas

- live tiles? allow apps to show some interesting info up front
- find by type (file / link is helpful)
- search results date strategy:
  - do separators based on time periods:
  - do by day for first week within the current month
  - do by month after that
- Fix empty profiles from gmail contacts import
  - Toggle select all button in table view
- fix highlight index click interaction
- fix integration buttons styling and going inactive after click
- cmd+z undo in search area (needs to work with toggles...)
- hoverGlow needs fix for x/left just like top/y
- @mcro/color: increaseContrast, decreaseContrast
- hmr: doesn't store.unmount stores often

### IF things are failing in about 6 months (assuming launch in about 4 months, beta in 2)

prototype out a much nicer launch page with the Orbit Ora, like this:

https://thehelm.com/

But basically have it be a tool for any type of app. Orbit can show them inside the actual pane itself.
