NEXT

1. Discussion over goals for this week and plans for next.
2. Plan for this week

client:

- [ ] syncers are choking up app speed

  - [ ] simple throttle
  - [ ] test to be sure you can add tabs when syncing is running and fix if not

- [ ] add a mediator with example command for Electron process

- settings panes fixes:

  - [ ] settings pane are loading/reloading their content every time
    - problem: slack/github have to load the table content every time you look @ them
    - solution:
      - new generic model prop Source.data
      - no need to type it yet, lets just get this working first
      - [ ] hook: `const [sourceData, updateData] = useSourceData()`
        - this is just a small function that extends current useModel
      - [ ] useEffect that fetches/persists their data for each setting pane
        - `useEffect(() => fetchData/updateData)`
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

  - [ ] 🐛 People aren't returning from the new SearchResult resolver, we should join in a summary of people:
    - have three people joined (just name + avatar)
    - have a count of the total people

- syncers:

  - [ ] throttle them
    - honestly just do it in a dumb way, please, it will take 5 minutes to do and works fine (await sleep(~ms) in the loops)
  - [ ] smart sync
    - [ ] heavy vs smart sync
      - heavy sync: limit initial full sync to 40MB per-integration
      - AFTER 40MB lets sync just some light information
      - light mode:
        - if content is above a certain size per-item (~2kb) use Cosal.getTopWords() to bring it down to maybe 30 words
        - for example slack heavy has attachments
    - make these runnable on client side:
      - [ ] `fetchFullItem` endpoint for every syncer
        - this basically can take a light item (item id) and return the full item (heavy)
      - [ ] `search` endpoing for every syncer
        - if the integration has a search endpoint we expose them all in the same manner so they return light bits
    - once thats ready we can move to step 2 for smart sync
  - [ ] on process exit it should clear all processing Jobs table
  - [ ] you can add the same exact integration twice, lets prevent that
  - slack:
    - [ ] partial re-sync, re-syncs doing a lot of work, slow down amt of resync too
    - [ ] seems like People arent showing the slack conversations on their profile
    - [ ] crawler doesn't seem to handle links in slack for me, it was timing out / not syncing
  - github:
    - [ ] limit the total amount it syncs
  - debug why gdrive syncer items show "empty" in frontend and clean that view up
  - website crawler:
    - depending on how hard this is we may cut it out
    - just check into if its working and spend max a day on cleaning it up

- non-syncing sources:

  - we need sources where it just lets you hook into a database essentially
    - all they really have is a `type`, and some credentials
    - [ ] add schema for this in Source
    - [ ] postgres:
      - [ ] lets create a fake postgres database with some data in the stack we can have a script setup
      - [ ] migration to automatically add that postgres source
      - [ ] find icon, add it to frontend code so you can configure it like Website Crawler
    - thats all for now, i will then build a simple app that lets us explore it easily

- easier migration story:

  - [ ] way to add a column to models without needing them to be recreated
  - [ ] in our "model startup failed, recovery" script, lets
    - [ ] dump models to JSON file in the dataDir directory so they are backed up
    - [ ] re-create tables using new schema (but see if maybe default values changed)
    - [ ] try and use that dumbed JSON to re-set up models using
    - [ ] if it fails just leave a comment for me i'll pick it up
