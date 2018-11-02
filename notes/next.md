# Ora - your memory

## November

### High level

Menu:

Topics - trending up/down
Lists - pin website or any part of screen
Orbit - see context just by hovering the O

App:

Opening app shows context (Home) which is the same as search by default. Basically we have two ways of showing all of Orbit, in the app window or in the menu.

In the menu you can do quick actions: copy link, open directly, or open the app view. In Orbit you can browse more easily and see in-app views.

We could bring back holding down Option to see context.

We'll get pinning working through the website crawler but later allow it to either use just "whats on screen" or "entire website" if they so choose.

We'll need accessbility permissions walkthrough.

Improving search in general including grouped search will be a big part of this.

Goal by end of the month is to cut a release and write a new blog post about it.

General idea of the blog post will be:

- Were making Orbit more useful.
- It will be like your digital brain - organizing everything you care about and letting you explore it intuitively.
- Later we can expand to teams but we want to get the personal experience right first.

### Breaking it down

We'll have four weeks in November to do this:

- Generally finish getting apps to show next to menu items and finishing menus
- Generally get the right way to persist data for these apps (lists mostly)
- Create topics app that shows some interesting topics as they move
- Create lists app that lets you pin, search, sort lists of things
- Get pinning mechanic down with accessibility walkthrough and crawler
- Prepare for OCR working by doing context:
  - Have a fake way to trigger fake context content
  - Make the search results "Home" show that when its active
  - Make the menu item for orbit show that when opened
  - Make holding Option show context
- Productionize and test, fix various new bugs
- Write blog post

### Unknowns

"People" seem to get lost in this. Sure they can be contextually relevant to what you're looking at so that is definitely useful then to show them. But perhaps sharing is another thing we can start to explore. Once you're in an Orbit it seems you could very easily share things then with people.

Topic modeling may take more time or be pretty intense. The menu may take a while to productionize fully.

"Me" could just be a section in search/home. So the other sections are more global but personal section is just filtered to your things. Perhaps concept of Me could also include your topics and interests over time.

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

ListsApp is up next:

- ListIndexApp - the list manager that shows in Orbit and in hover menu
- ListApp - looking at a list, has sorting, search filtering and opening items

umed:

1. testing search with various filters, fixing performance
2. syncing a lot of data to test and fix performance
3. fixing syncers to avoid overfilling hard drive
4. splitting out locations into a new model so we can use them for various things
5. create a unified profile for the person using orbit: we should get information on their gmail, slack, github and we can figure out their emails they use across them to link them together (more on this during call)
6. creating a link-crawler that can be hooked into any syncer with an option (so if theres a link in slack we can crawl that link using the website-crawler and add it as a bit)
7. improving the way we handle raw vs formatted data on bits so its more consistent
8. fixing google drive settings pane so it works and we can select folders using a searchbar
9. search-based sync where we can index more stuff based on their searches by hitting the API for their search directly
10. see if we can get website-crawler working using their chrome or just download puppeteer into a shared config directory we make

questions:

- a query for bits made by "me"
- also can't we unify the profile for "me" very easily?

  - if so, then on a team level as everyone adds themselves into orbit we can unify all profiles between them!

nate:

- two ways to get interesting topics:
  - topic modeling exploration:
    - setup test script environment
    - using cosal:
      - scan documents using cosal
      - if you find bi/tri-grams of salient words, store
      - count times you see those bi/tri-grams
      - do for whole corpus
      - sort by most counted and use that for topics
    - using pre-defined:
      - take recent 3000 bits you've produced
      - sort most salient topics to those bits and product topic list

design:

- topic based exploration
- memory and pinning/adding content

topics:

- use cosal to filter down large wikipedia title list
- clean up list to be somewhat interesting topics
- build a small repl with cosal to test
- test:
  - get topmost topics based on given corpus
  - then take those topics find top X documents close to them
  - show that as a list of lists and see if it looks interesting

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

this week:

- fix settings panes showing
- it should pre-search the next pane, _after_ current one finishes... :/ (idle() callback)
- fix space creation pane
- mock onboard: add integrations => show available orbits to join
- animatee the orbit while searching..

goals:

- want to have much better step by step plan, deliverables and review of progress
- want to have high level goals for november, december, january
- want to have detailed goals for november fully mapped out

# October

Nate:

- Search
  - condensed, grouped search with far better display of each item
  - recent items by default in search (weighted much higher)
- Spaces
  - Switch spaces

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
