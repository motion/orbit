notes from onboarding andrew:

- adding app to local apps not reloading
- some bug with Desktop.state.workspaceState.nameRegistry not being set after adding local app
- reloading of apps would be important from the UI in case things dont work
- return errors from app methods / postgres to UI
- searchResults app shouldn't insert by default
- make workers wait for app to finish startup before starting
- node rebuilding slowly
- useApp() is hard to use, you have to pass the AppBit, and useAppBit() takes an id it should just take a normal FindOptions

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

Aug

hire......... so someone can do "Really be able to develop an app"

me: "Really be able to sync config between"

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

Goal #2: Syncing configuration and other information p2p

1. App config and space config should sync through hyperswarm
2. Link that into Spaces and testing it out

Goal #3: Apps store for p2p

1. In the same way public one works, but instead uses hyperswarm
2. Allow for teams to collaborate without publicly sharing anything
3. May need some consideration for linking to github repo (instead, in addition to?)

---

Questions:

small:

- gloss could probably memo pretty well, should make adjustments using the benchmarks
  - custom memo function:
    - if children set, dont memo at all
    - do a few smart props that we know are usually POJOs
