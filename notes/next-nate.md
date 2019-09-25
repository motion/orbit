The plan from jun for Sep:

"Have everything ready for beta"

- Improved demo flow x2 (apps, bugs, etc)
- Build to production

they have conflicting sub-contraints in cases, resolved to (in order of importance):

- [beta/demo] runthrough + bugfix over and over
- [demo] plug in simple ocr/import menu command
- [beta] startup time fixes and clean workspace fixes
  - startup needs to be a "chunk" to focus on:
    1. make it load without webpack running (static serve to start)
    2. show an electron loading window pre-launch instantly then transition to app
       - can plugin 3d loading animation via danny later
    3. (~tech-blocker) webpack 5 for faster from-cache resuming
- [beta] search UI fixes
- [beta] HMR/dev fixes and upgrades
- [beta] search backend (nlp + scan more fixes)
- [beta] settings upgrades: fix sort, remove, improve flows
- [demo] ~potentially do a demo of option hold to see context menu
- [site] cleanup sub-pages
- [site] run over docs for a few days
- [beta] query builder finish

Sep 12:

- fix some app stuff:
  - no rebuild all node apps
  - improve startup build logic
  - show a window immediately on startup that shows status of builds
  - fix dev mode toggle regression
  - no watch in prod mode plz
  - fix sorting apps

- dev mode runthrough
  - test errors/error recovery
  - improve "retry" button
  - fix/improve open in vscode (go to app folder)
  - show better dev status (building spinner in header)

- handle deleting apps, adding apps better
- get clean workspace build better


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

- [ ] Last Features to tie it all together?
  1. "Move Data" modal, see block below
  2. See DataDog, could pull some auto-dashboard example apps

- [ ] Demo apps that would be compelling:
  - [ ] Some sort of easy drag/drop in/out type thing
  - [ ] Some sort of data browsing/plugin app:
    - [ ] Database browser could be useful
    - [ ] GraphQL usage would be helpful

- [ ] Build to production
  - [ ] !!! we can't do this right now for electron 8 though without some trouble, so no rounded windows..?
  - [ ] Get build to prod working
  - [ ] + get build to prod with full flow of app editing working


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

- [ ] React Window is being re-written again by bvaughn, there are bugs in it currently, an afternoon to revisit and see if we can upgrade to that version

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

-- High level

First: working, non-buggy demos of everything. Visually impressive.

- Drag/Drop with OrbitSearchResults
- Get interaction with search + show AppShowBit proper
- Fixing bugs with carousel/drawer/drop

- make a generic app for search + display data that you can drag a query into
make user manager app use grid layout probably
make slack app search something large and put it into layout demo app or similar

---

next

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

need to talk to a few startup people to get some feedback:

- Webflow CEO
- Framer cofounders
- Zeit/Expo cofounders
- ... add a few more

Questions:

small:

- gloss could probably memo pretty well, should make adjustments using the benchmarks
  - custom memo function:
    - if children set, dont memo at all
    - do a few smart props that we know are usually POJOs

- https://github.com/humandx/slate-automerge

- monobase for the individual docs sites...

ideas:

- mdx mode:
  - support a "simple" mode where you can code in just mdx
    - benefits:
      - ✅ no import, no export default, no return this/that
      - ✅ ui + kit available as global
      - ✅ can still import whatever you need from regular ts files
      - ❌ no autocomplete in editor likely
      - ❌ another syntax to learn/maintain
      - ❌ how do you do stuff like hooks?

- devtools mini-app:
  - ✅ a lot like xcode's new spotlight/search devtool mode, desirable/easy/fast
  - ✅ can show a lot of tools: react devtools, mobx, overmind, repl, custom state inspector
  - ✅ easier cost to useful/attractive ratio than some features
  - ✅ helps build orbit faster
  - ❌ not insignificant amount of work
