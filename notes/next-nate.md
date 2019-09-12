Technical todos:

- fix toggle into dev mode regression
- get startup time down
- get clean workspace build better
- handle deleting apps, adding apps better
- handle errors in dev mode
- show build status messages better


The plan from jun for Sep:

"Have everything ready for beta"

- Improved demo flow x2 (apps, bugs, etc)
- Build to production
- Website improved with better docs / home text

---

1) Am I on track?

Yes, but will need to work really hard on demo apps, and be sure to do docs every day.

2) My daily plan should be?

- A lot of DX initially, to see if we can make myself faster
- Half day:
  - stability, performance, "Orbit" high level stuff
- Quarter day:
  - apps, focused entirely on demo apps dfeeling good
- One hour:
  - website/docs

---

Detailed September Plan:

- [ ] Finish motion/carousel
  - [ ] Carousel is definitely slower, need to test with more items too
  - [ ] Performance opening drawer
  - [ ] Fix a lot of correctness bugs (resize window, etc)
  - [ ] Check into regressions on keyboard movement in main area/apps (is it moving inside apps when it shouldnt?)

- [ ] Get Concurrent working with priority on new react
- [ ] Fix a ton of bugs:
  - [ ] Search has some glitching when showing items
  - [ ] QueryBuilder has so many, including performance
  - [ ] Get the whole flow of install/delete/edit working again

- [ ] Lists app should have a lot of improvements
- [ ] General performance run would help a ton
  - [ ] Especially things like:
    - [ ] During sync I think its saving bits often and causing lots of updates

- [ ] Build to production
  - [ ] !!! we can't do this right now for electron 8 though without some trouble, so no rounded windows..?
  - [ ] Get build to prod working
  - [ ] + get build to prod with full flow of app editing working

- [ ] Last Features to tie it all together?
  - [ ] Should I do anything more????
  1. Floating "selection" may be it.
  2. "Move Data" modal, see block below

- [ ] Demo apps that would be compelling:
  - [ ] StackOverflow Clone
  - [ ] Some sort of easy drag/drop in/out type thing
  - [ ] Some sort of data browsing/plugin app:
    - [ ] Database browser could be useful
    - [ ] GraphQL usage would be helpful


----------

MOVING DATA

This is an umbrella for "how to move things around easily".

I think a modal would work well, where in any context you could bring it up.

Imagine an almost automator/shortcuts(ios) style multi-pane thing

Either select items or define query
  > preview those itmes
  > add a transform
    > tranform can select fields, apply code to them
  > add an output
    > output can send it to a data-app
    > can select fields, apply code


------------


GO TO PROD / DEV TASKS

- [ ] FastRefresh once Webpack plugin is ready for both our own stack + the individual apps.
- [ ] Webpack 5 will be instrumental in more easily going to production, check if its ready for integration as its picked up some steam.
- [ ] React Window is being re-written again by bvaughn, there are bugs in it currently, an afternoon to revisit and see if we can upgrade to that version


----------


NEW SITE SECTIONS:

1. "heads up display" + "apps for teams" + "simple"
2. screenshot/illustration
3. Make apps, easy (show more)
4. Augment your OS (show interaction with home)
5. Best DX, ever (hover to define DX) (SHOW MORE)
6. IN as easy as OUT (show OCR/pinning + syncing/graph)
7. BATTERIES => FEATURES
   1. Have 3 buttons on the top with sections:
      1. (Development)
         1. Webpack 5
         2. Fast Refresh
         3. 100ms HMR
         4. Visual App Manager
         5. 0-config Build system
      2. (Interface)
         1. Virtualized Tables/Lists
         2. Powerful Selections
         3. Forms, Flows
         4. 80 Components, 50 hooks
         5. Suspense integrated / hooks
      3. (Apps)
         1. Syncers/Multi-Process
         2. QueryBuilder
         3. GraphQL
         4. Drag/Drop
         5. Shared Bits
         6. Clipboard
         7. NLP/Searchable

(if anything, just show footer here and have a FEATURES page)

1. Easy deploy (move the deploy stuff down to here)
...

Features page could show each individual app in more depth basically,
very simple layout with some brighter colors and screenshots.


Really nice app flow:

Notes app
RSS app

Have them both work together.

---

- [ ] fix pane resizing bugs
- [ ] fix issues using different app apis, test
- [ ] persisting queries
- [ ] persisting to bits the query information
- [ ] parameters can add/remove them
- [ ] parameters can use them in queries
- [ ] can drag/drop a query into a table

notes from onboarding andrew:

- reloading of apps would be important from the UI in case things dont work
- return errors from app methods / postgres to UI
- searchResults app shouldn't insert by default
- make workers wait for app to finish startup before starting
- node rebuilding slowly

- need to refresh searchResults sometimes when youve added bits, dont do too smart just check for saves
- SelectableStore should export themselves into a global, based on if they are visibile, and then esc can clear selection before doing anything else

---

instead of useUserState / useAppState:

```
useData('id', defaultValue, {
  persist: 'user' | 'app' | 'memory',
})
```

this lets it be configurable easily, see <Flow />.

<Flow persistStep="user" persistData="app" />

---

Lists:

- All wysiwig
- Wysiwig can have a content chooser that shows it in modal

---

-- High level

First: working, non-buggy demos of everything. Visually impressive.

- Move search out of drawer and make "/" just work on OrbitSearchResults
- Drag/Drop with OrbitSearchResults
- Get interaction with search + show AppShowBit proper
- Fixing bugs with carousel/drawer/drop

Fix query builder postgres loop with drag/drop
make a generic app for search + display data that you can drag a query into
make user manager app use grid layout probably
make slack app search something large and put it into layout demo app or similar

---

# PART TWO

not sure...

wants:

"Easily interacting with APIs"
"Local data you can manage / share with team"

concretely:

querybuilder for postgres or some other
card app + apis (slack grab some data)
move that data into a list
table with a variety of filters easily defined

---

next

---

Oct

"Launch in private beta"

- Improve demo apps
- Upgrade build/release process (auto updates etc)
- Get builds in hands of friends for initial debugging

Nov

"Public beta launch"

- Upgrade docs, website, etc
- Really improve apps/demos
- Start on dockerizing things for cloud stuff

Dec

"Sell it / Launch"

---

First, need to talk to a few startup people to get some feedback:

- Webflow CEO
- Framer cofounders
- Zeit/Expo cofounders
- Retool?
- ... add a few more

Questions:

small:

- gloss could probably memo pretty well, should make adjustments using the benchmarks
  - custom memo function:
    - if children set, dont memo at all
    - do a few smart props that we know are usually POJOs

- https://github.com/humandx/slate-automerge

- monobase for the individual docs sites...
