make search actually good

- search relevancy - build a dataset, test, improve, use cosal, etc
  - build up some bigger data to test on
  - build up some search terms to test and iterate on
- ux
  - enter to open
  - bigger peek windows
  - have peek open automatically on search
    - on new searches reset index to 0 not -1, keeps the peek open as you filter things
- goal:
  - be able to try a couple things and find recent stuff almost always
    - join together ALL slack conversations that match your query in the results window into infinite scroll!!!!!
      - that way you can search one thing, see slack, hit results
      - also would let you group together slack things much more easily
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

# next

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
