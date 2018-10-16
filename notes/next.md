umed:

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
- search relevancy - build a dataset, test, improve, use cosal, etc
  - build up some bigger data to test on
  - build up some search terms to test and iterate on
- ux
  - enter to open
  - bigger peek windows
  - have peek open automatically on search
    - on new searches reset index to 0 not -1, keeps the peek open as you filter things
  - GROUP together conversations in search results by much bigger amounts
    - and then in peek windows you can see them all together
    - join together ALL slack conversations that match your query in the results window into infinite scroll!!!!!
      - that way you can search one thing, see slack, hit results
      - also would let you group together slack things much more easily
  - GOAL: be able to try a couple things and find recent stuff almost always
- look into better topic based search / high level search
  - generate topics in desktop - show them in quickresults?
- smarter, better, less buggy, syncers
  - remove "archived" gmail
  - sync more until space filled
  - sync more as you search
  - gdocs auto sync most things by default
  - Really simple throttle to keep cpu from going too much
- profiles
  - link people together better across integrations
  - rethink them and design using topics and higher level summaries
  - integrate them better into search results
- location as a model
  - lets us query locations for sub-searches

## profiles beta:

- quick actions: talk in slack, send email
- bigger, beautiful overview design

# next / ideas

- live tiles? allow apps to show some interesting info up front

- clicking location buttons should filter that location
- clicking a name should search that name
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
- peek arrow position shouldn't straddle weird borders
- hoverGlow needs fix for x/left just like top/y
- @mcro/color: increaseContrast, decreaseContrast
- hmr: doesn't store.unmount stores often
