## next

small apps for teams

### nate

tuesday:

- fix selection store getting into bad state / not moving
- fix keyboard selection move
- add auto select on search first item
- fix clear app window on clear peek

- apps have sidebars inside them

  - create new titlebar / icon with button to toggle sidebar
  - restructure apps to have sidebar from their Main view
  - get sidebar in and working, resizing
  - fix some tear away bugs

- contextual search app
  - only shows individual items

wednesday:

- design for pin current app context to pin
- Upgrade people app with "Send icon" for context + showing peek next to it + search bar
- Lists Main app view app - show sidebar in app with button + searchbar
- SelectionStore / keyboard interaction working for menu windows
- Orbit search results context menu opens by default (not show last one)
- Fix cosal invert bug
- Get Topic modeling API in place with working topics for topics app
- Get profiles with topic modeling
- Get topics app using real data for changing over time topics
- UI for custom topics in topics app
- Rename SourcesStore.activeSources and OrbitIntegration<> => OrbitSource types

---

Monday:

- Keyboard nav into the main-windows
- Walkthrough accessibility permissions
  - Custom Notifications :) would allow a lot
- Person app send via slack/gmail
- Hoversettler for menu peeks

Tuesday:

- Actual storage of data for each app
- Lists app work

Wednesday:

- Topics app work

Thursday:

- App view improvements
- Person app quick send actions

---

umed:

- umbrella: Search
  - fix measurement bugs in search results list
  - search performance
  - hide empty sections if there are no groups
  - make "all period" never group -- just fills in just all most accurate items that _are not_ already shown above
  - the highlighting of NLP terms broke somewhere, check SearchInput and HighlightedTextArea and see where its breaking
- people syncers: if slack is added, use that as source of truth and only add other people "on top"
  - add an option to set "source of truth" setting in settings panes
- github view: fix not showing comments content
- github view: fix can't select text with mouse
- window resize with re-resizable needs work
- Team account management and onboarding flow
- Search performance / groups
- Fix search filters and date filters
- Fix NLP filtering and test it
- Re-enable quickresults in search

- People:

  - Gmail should sync People more strictly:
    - Only insert a person if _I_ sent them an email (not a reply but new email)
    - But if a person exists already (via slack, jira, github, etc), still attach the email to that existing profile

- Space management

  - Should be able to register a new Space under some sort of login (ours or via Slack/Google)?
  - Should be able to name team, rename team, and choose/change the login integration
  - Should have a cloud server on our side that syncs this
  - Should sync the apps settings to the cloud server

- Context

  - We need access to current app

- Lists App:

  - Make sorting work in AppModel.data (should we call the model AppData or something so its more clear?)
  - Make the top level Lists Bits and work with search
  - We need a way to rename and add lists, basic interface there
  - Fix sorting bugs (it goes clear for some reason)
  - "Pin" button should

- ## Apps data storage:

* lists/topics/people

---

```
t = JSON.parse(require('fs').readFileSync('/Users/nw/projects/motion/orbit/app/orbit-desktop/src/titles.json', 'utf8'))
a = await Promise.all(t.slice(0, 10).map(async term => {
  const results = await Root.cosal.search(term, 10)
  const bits = (await typeorm.getRepository(BitEntity).find({ id: { $in: results.map(x => x.id) } })).map(bit => (
    bit.data.messages ? bit.data.messages.map(m => m.text).join('...') : bit.body
  ))
  return {
   term,
   distances: results.map(x => x.distance),
   bits,
  }
}))
```

search:

- dont underestimate how far you can get by just making search great
  - search images
  - search links
  - better previews/results
  - bigger peek better clearer display
  - clearer shortcuts
  - pin to list
- #searchbytopic
- /filtergroups
- query to avoid loading `data` and `body`
- quickresults: this can avoid a call alltogether

  - just do it in memory!
  - basically: load all recent bits + all people in memory
    - when you type it just filters them (webworker or desktop?)

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

# next / ideas

- find by type (file / link is helpful)
- Toggle select all button in table view
- fix integration buttons styling and going inactive after click
- cmd+z undo in search area (needs to work with toggles...)
- hmr: doesn't store.unmount stores often

# ideas for apps

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
