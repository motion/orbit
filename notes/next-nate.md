--

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

- adding app to local apps not reloading
- reloading of apps would be important from the UI in case things dont work
- return errors from app methods / postgres to UI
- searchResults app shouldn't insert by default
- make workers wait for app to finish startup before starting
- node rebuilding slowly

---

useState hooks:

instead of useUserState / useAppState:

```
useAppState('id', defaultValue, {
  persist: 'user' | 'app' | 'memory',
})
```

this lets it be configurable easily, see <Flow />.

<Flow persistStep="user" persistData="app" />

---

Lists:

- Content type chooser:
  - In lists when you create new item you can choose the content type:
    - We can also allow folders, but content type chooser is a grid
    - In the grid we show all content types Orbit understands and render them
  - Then, we can have a WYSIWIG content type provided by an editor App.
  - Or we can have a Code content type provided by a code app.


- SelectableStore should export themselves into a global, based on if they are visibile, and then esc can clear selection before doing anything else

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

"Have good demo apps"

Oct

"Fix up site and onboarding for launch"

Nov

"Sell it to some early users"

Dec

"Launch"

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
