nate:

Topic modeling

Cosal and topic modeling is a dependency for search, profiles, and topics. So it needs to come first.

- add more topics
- test and iterate on finding topics
- finding unique terminology in company
- Fix cosal invert bug
- need some work on frontend after
  - managing topics
  - topicsmain app
  - profiles with topic modeling

Ensuring we can release next beta somewhat soon and also have good demo:

- Improving and fixing all the bit views
- Making grouped search main view work
- Fix all selection issues
- design for pin current app context to pin

Apps:

- get sidebar resizing
- fix tear away bugs
- fix app focusing bugs
- create new titlebar / icon with button to toggle sidebar

Tray:

- add auto select on search first item
- Orbit search results context menu opens by default (not show last one)
- contextual search app only shows individual items

Demo:

Demo will have huge returns on fanciness, as well as launch. Even if we sacrifice certain features working perfectly, having it feel "new" is more important than it delivering massive value day one. Not that it shouldn't, it should deliver value and the topics/vocab/people app especially should focus on making this apparent. But beyond that, excitement mostly comes from people believing this is "the next cool thing" and that activation threshold is very high. But, once activated, it has massive returns, and a positive feedback loop. We're close to hitting it: between custom contextual apps with app windows, tear away into app windows, and topic modeling for peoples profiles and company vocab, i think we're nearly there. OCR of course would wow, and augmented computing. But for all of this to really be believable it requires it to all be stable enough that we can not only "record a demo video" of it all but actually release it into peoples hands.

Contextual stuff is high on this list:

- Showing current app in a context popover
- Letting you pin context into lists
- Letting you send context to people
- Searching your recently viewed items

And then basically app-store app-building, which has a big hill to climb that we're about 1/4 of the way (needs to be about 1/2 for "beta"):

- Having the right topic/ocr API structure
- Showing them in context
- Augmented
- Integrated easy dev experience

---

umed:

- Search

  - we need to just do the simplest things to get things working:
    - should understand first how much overhead fts adds
    - grouped search using raw sql is probably best for now
    - get that working fast first just using simple querying
    - get the filters and nlp based filters working
      - search for a name "umed", search for a type "gm"
    - we should sync less data: no html parsing stuff just do readabiltiy on html or get text straight from api
      - we can show readability from gmail messages for now, we aren't trying to be a full mail client just a quick way to peek at things
    - we should aim for having endpoints where we could then "fetch" the html easily in the frontend
      - goal is to get it done quick, simply
    - goal is to have grouped search feeling very fast as soon as possible...

- people syncers: if slack is added, use that as source of truth and only add other people "on top"

  - no need for people from every integration, but do need to figure out if its the "same person from slack"
  - add an option to set "source of truth" setting in settings panes

- small things to do:

  - make search items drag/drop their links: https://electronjs.org/docs/tutorial/native-file-drag-drop
  - github view: fix not showing comments content
  - github view: fix can't select text with mouse
  - drag and drop items from menu: https://electronjs.org/docs/tutorial/native-file-drag-drop

- Lists app:

  - we should persist lists to Bits so they are searchable
  - from there you can refactor to support making re-ordering work
  - we need "edit names", that can be a button next to Pin button and if you hit it it happens in the ListEdit view to start (simplest way to start)
  - Delete item button
  - Inside ListMain when in App
    - it will need a sidebar: should show Search sidebar in this case
      - may need some fixes there
    - after you search it needs a way to "add to list"
    - Remove button for list items in there

- Instead of using the cloud auth server it looks like we _can_ do https locally:

  - Goal is to use mkcert and see if we can then do oauth fully locally
  - And then if so transition the stack over to that and delete the old oauth server stuff
  - see: https://github.com/FiloSottile/mkcert
  - we already ask for sudo permission and do that during onboarding it can just go there
  - that all happens here:
    - OnboardManager when it sees permission:
      - calls PortForwardStore.setupDNSProxy
      - that runs a sudo node process on the file "proxyOrbit.js"
  - see: proxyOrbit.ts
    - we need to change it to also install/run mkcert and add orbitauth.com with https
    - firefox support would be good using mkcert instructions

- Frontend

  - AppPage/AppFrame window resize with re-resizable needs a lot work to work well
  - goal is to be able to resize app windows
  - there are some bugs in app windows with focus, may require you to check there

- Team account management and onboarding flow

  - Create a server and database system that is good for handling signups

---

unsorted:

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
