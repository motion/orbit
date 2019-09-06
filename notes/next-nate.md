NEW SITE SECTIONS:

1. "heads up display" + "apps for teams" + "simple"
2. screenshot/illustration
3. Make apps, easy (show more)
4. Augment your OS (show interaction with home)
5. Best DX, ever (hover to define DX) (SHOW MORE)
6. IN as easy as OUT (show OCR/pinning + syncing/graph)
7. REPLACE Batteries included with a quick feature rundown w/screenshots:
   1. GraphQL browser
   2. QueryBuilder
   3. Bit Explorer
   4. Large UI Kit
   5. etc

(if anything, just show footer here and have a FEATURES page)

8. Easy deploy (move the deploy stuff down to here)
...

Features page could show each individual app in more depth basically,
very simple layout with some brighter colors and screenshots.






Really nice app flow:

Notes app
RSS app

Have them both work together.

---

Weekend goals!!!!!!

- [ ] Get ocr fully linked in with tray => Bit
- [ ] get tray showing a dropdown menu
- [ ] fix apps make the loop from "CMD+N" to actually editing and app <10s
- [ ] do all querybuilder improvements
- [ ] more wysiwig

---

- [ ] fix perf issue with switching between items
- [ ] fix pane resizing bugs
- [ ] fix suspense flickering issues
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

Sep

"Have everything ready for beta"

- Improved demo flow x2 (apps, bugs, etc)
- Build to production
- Website improved with better docs / home text

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

---

there should be a concept of "extensions" that could be loaded via app store.

extensions would be basically a DLL that provides functionality to all apps.

examples:

- MonacoEditorExtension provides a code editor, you can import and use it.
- DraftEditor Extension (wysiwig)
- NLP/Screen/Etc
- Then apps would have to declare the extensions they rely on and have orbit install
- Is very tricky in terms of reloading, would require a hard reload likely

---

Questions:

small:

- gloss could probably memo pretty well, should make adjustments using the benchmarks
  - custom memo function:
    - if children set, dont memo at all
    - do a few smart props that we know are usually POJOs

- https://github.com/humandx/slate-automerge
