NEXT

1. Discussion over goals for this week and plans for next.
2. Plan for this week

client:

- [x] solution for multiple mediators, seems like one works but if i launch two apps i get another error
- [x] look at some // TODO @umed and see if you can fix up some types
- [x] can you make useStore(Store, { ...props }), the "props" object accept types properly, see useStore.ts and see example usage in many places, like ListsApp.tsx and ListStore.ts
- [x] have the electron process accept mediator commands -- did you do this already?

- settings panes fixes:

  - [x] i still see flickering/slow loading for slack settings, is it really using the model?
  - [x] settings pane are loading/reloading their content every time
    - problem: slack/github have to load the table content every time you look @ them
    - solution:
      - new generic model prop Source.data
      - no need to type it yet, lets just get this working first
      - [ ] hook: `const [sourceData, updateData] = useSourceData()`
        - this is just a small function that extends current useModel
  - [ ] some settings panes are broken
    - check over them all and fix bugs
    - this is actually a medium size task because each pane needs some work

- cache improvements:

  - [ ] can you make `remove()` work with the cache
    - test case: removing a tab by right click > remove
  - [ ] can you look at why creating a new app is slow to update the tabs
    - steps to reproduce:
      1.  click the "+" button in tab bar
      2.  select "Custom"
      3.  "Create"
      4.  notice it takes about a second before it shows up in the tab bar
      5.  see if thats caused by SQL speed. It can be delayed a little bit but updating sqlite and sending over socket should be super quick, so we don't need fancy caching here just to be sure the sql/subscription is fast

- backend:

  - [ ] 🐛 small: in Desktop, observable findOne queries don't have exceptions properly handled so its hard to know what query it was and debug args - "Desktop: Possibly Unhandled Rejection: Wrong arguments supplied. You must provide valid options to findOne method." - adding a try/catch that works and shows the arguments passed would be helpful

- search:

  - [x] 🐛 People aren't returning from the new SearchResult resolver, we should join in a summary of people:
    - have three people joined (just name + avatar)
    - have a count of the total people

- syncers:

* [ ] on process exit it should clear all processing Jobs table

  - [ ] you can add the same exact integration twice, lets prevent that
  - slack:
    - [x] partial re-sync, re-syncs doing a lot of work, slow down amt of resync too
    - [ ] seems like People arent showing the slack conversations on their profile
    - [ ] crawler doesn't seem to handle links in slack for me, it was timing out / not syncing
  - github:
    - [ ] limit the total amount it syncs
  - debug why gdrive syncer items show "empty" in frontend and clean that view up
  - website crawler:
    - depending on how hard this is we may cut it out
    - just check into if its working and spend max a day on cleaning it up

* non-syncing sources:

  - we need sources where it just lets you hook into a database essentially
    - all they really have is a `type`, and some credentials
    - [ ] add schema for this in Source
    - [ ] postgres:
      - [ ] lets create a fake postgres database with some data in the stack we can have a script setup
      - [ ] migration to automatically add that postgres source
      - [ ] find icon, add it to frontend code so you can configure it like Website Crawler
    - thats all for now, i will then build a simple app that lets us explore it easily

* easier migration story:

  - [ ] way to add a column to models without needing them to be recreated
  - [ ] in our "model startup failed, recovery" script, lets
    - [ ] dump models to JSON file in the dataDir directory so they are backed up
    - [ ] re-create tables using new schema (but see if maybe default values changed)
    - [ ] try and use that dumbed JSON to re-set up models using
    - [ ] if it fails just leave a comment for me i'll pick it up
