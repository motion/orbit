---

gloss:

1. theme is just defaultProps but all are css variables
2. gloss(view, { background: 'red' } <- default props)
3. theme(props => ) <- no theme, theme is just default props
4. scale is just cssvars: xxs, xs, sm, ....
5. move surface sizing into theme
6. move subsets to objects: listItem: {}, etc
7. <Theme for="button" scale="lg" /> <- theme just acts as a css var setter

---



gloss:

1. Make it so the second param of gloss takes props:

const X = gloss(Stack, { direction: 'horizontal' })

gloss would have to split it out

1. Add an `is={}` property, can be `is="Name"` or `is={Component}`, doesnt replace tagname its more for describing.

---

need to make some changes to gloss to make it work well with static styles

right now view looks like this:

Base = gloss().theme(propsToStyles, pseudosToStyles, alphaColorTheme)
View = gloss(Base).theme(usePadding, useMargin)

this is really flexible, but not really statically analyzable.

changes we want to make:

1. gloss should handle propsToStyles + pseudosToStyles automatically

changes would be:

 - make gloss do propsToStyles + psuedosToStyles for all views
 - remove it from Base

2. alphaColorTheme basically does this:

<Theme theme={{ color: 'red', colorHover: 'blue', alphaHover: 0.5 }}>
  <View color="red" alpha={0.5} alphaHover={1} />
</Theme>

how do we make that statically extractable?

options are:

  - make alpha first class in gloss, since its used almost everywhere
  - if we have the theme function there, we can run it and determine if it uses only variables, and then continue to statically extract, we do already have the tracking

actually theme tracking seems really nice because it basically requires no
rewrite and we can determine many things. it only adds one constraint:

"no themeFn should use a conditional inside of it"

which is reasonable because... we don't really do that now. maybe in a couple cases, but almost never and its easy to rewrite to avoid. plus, we can detect it and bail at compile time if necessary.

for example look at Input.tsx, it has an elementTheme it passes


---

re: Surface

this could be redone to be more composable:

Surface does a lot right now, and its quite powerful and flexible but hard to optimize and heavy for basic use cases.

- Glint
- Hoverglow
- AutoSizing
- Breadcrumbs/Segmenting
- Tooltip
- Badge

we can split this all up, at the cost of the user having to understand a lot more and not "just use props", with benefit of full static compilation abilities and less overhead in non-static cases + a lot more flexibility in styling.

plus, we could then re-build surface if we wanted to anyway. something like RichSurface and Button/Input could use them by default. though i think i'd still write them differently and you'd get better optimization....

still, its a good exercise because figuring it out means we figure out a good theme system in general soooo away we go:

<Stack theme="surface" size="lg" space spaceAround direction="horizontal">
  <Icon />
  <Text></Text>
</Stack>

actually this seems to work.... because themes can handle all the hovering, border radius etc. size/space can go directly into theme variables right?

then we could just abbreviate it as:

<Surface icon="">
  Hello world
</Surface>

and still get the benefits?

button would look like:

<Surface coat="button">
  Hello world
</Surface>

we'd basically remove subSelects and just have them be coats right?

...wrong. how do we then do <Button coat="flat" />. hm.

so themeSelect would stay?...

<Surface themeSelect="button" coat="flat">
  Hi
</Surface>

where themeSelect basically just puts together a selection of variables from the parent theme, which are *just props*!. So keep in mind we can do stuff like:

const LightTheme: Theme = {
  background: 'red',
  backgroundLight: 'pink',
  buttonBackground: 'green',
  buttonBorderWidth: 1,
  buttonHoverStyle: {
    background: '--backgroundLight'
  },
}

How does this help in the case where you have grouping? It seems it really can't
account for that. Wait, nm, it can. We can deopt on group which we already basically do.

What about all the weird transforms we do for icons/children in Surface render function right now?

That basically is all passing down stuff we'd capture in props or theme. It seems the commong pattern is we need:

- Theme === Props, theme should just be a default representation of props that simplifies so much in terms of rules.
- Actually in that way we could probably have the following themes:

const LightTheme: Theme = {
  background: 'green',

  Button: {
    background: 'red',
  },

  Input: {
    ...
  }
}

Second, we'd have an idea of the props they accept so we can know if we can compile away.

But back to the question, how does an Icon thats a child of a Button automatically receive the colors and such, even if its set through props?

??????? hard need to think over more

basically you could go all "full optimizing compiler" in a sense, not crazy advanced but pretty damn advanced, you could do this:

<Theme theme={{ buttonGlint: true }}>
  <Surface size="lg" tooltip="hi" glint={false} />
</Theme>

wait........ contextual themes :/

function Surface(props) {
  return (
    <Stack id="id">
      {props.glint && (
        <Glint />
      )}
      {props.tooltip && (
        <Tooltip>id</Tooltip>
      )}
      {props.badge && (
        <Badge>123</Badge>
      )}
    </Stack>
  )
}

What about glints?

as long as we can optimize them all down to "div"s then I see no reason why we dont just render the divs on every surface. i think thats the way to get it to optimize, lets say:

Surface = () => do {
  const theme = useTheme()
  <Stack ...>
    {theme.glint && props.glint !== false && <Glints  />}
  </Stack>
}


---

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
  - ✅ tools:
    - react devtools, mobx, overmind, chromium repls, chrome dev tools, custom state inspector
  - ✅ easier cost to useful/attractive ratio than some features
  - ✅ helps build orbit faster
  - ❌ not insignificant amount of work

-

---

google sheets:

this is a huge use case, and should be in the demo.

sheets to form to database would be huge.

---

The plan from jun for Sep:

"Have everything ready for beta"

- Improved demo flow x2 (apps, bugs, etc)
- Build to production

they have conflicting sub-contraints in cases, resolved to (in order of importance):

- [beta/demo] runthrough + bugfix over and over
  - no rebuild all node apps
  - show a window immediately on startup that shows status of builds
  - fix sorting apps
  - handle deleting apps, adding apps better
  - test errors/error recovery
  - improve "retry" button
  - fix/improve open in vscode (go to app folder)
  - show better dev status (building spinner in header)
- [demo] plug in simple ocr/import menu command
- [beta] ~tech-blocker webpack 5 for faster from-cache resuming
- [beta] search UI fixes
- [beta] HMR/dev fixes and upgrades
- [beta] search backend (nlp + scan more fixes)
- [beta] settings upgrades: fix sort, remove, improve flows
- [demo] ~potentially do a demo of option hold to see context menu
- [site] cleanup sub-pages
- [site] run over docs for a few days
- [beta] query builder finish

---

Detailed September Plan:

- finish motion/carousel

  - carousel is definitely slower, need to test with more items too
  - performance opening drawer
  - fix a lot of correctness bugs (resize window, etc)
  - check into regressions on keyboard movement in main area/apps (is it moving inside apps when it
    shouldnt?)

- get Concurrent working with priority on new react
- fix a ton of bugs:

  - search has some glitching when showing items
  - queryBuilder has so many, including performance
  - get the whole flow of install/delete/edit working again

- lists app should have a lot of improvements
- general performance run would help a ton

  - especially things like:
    - during sync I think its saving bits often and causing lots of updates

- last Features to tie it all together?

  1. "Move Data" modal, see block below
  2. See DataDog, could pull some auto-dashboard example apps

- demo apps that would be compelling:

  - some sort of easy drag/drop in/out type thing
  - some sort of data browsing/plugin app:
    - database browser could be useful
    - graphQL usage would be helpful

- build to production
  - !!! we can't do this right now for electron 8 though without some trouble, so no rounded
    windows..?
  - get build to prod working
  - - get build to prod with full flow of app editing working

---

MOVING DATA

This is an umbrella for "how to move things around easily".

I think a modal would work well, where in any context you could bring it up.

Imagine an almost automator/shortcuts(ios) style multi-pane thing

Either select items or define query

> preview those itmes add a transform tranform can select fields, apply code to them add an output
> output can send it to a data-app can select fields, apply code

---

GO TO PROD / DEV TASKS

- [ ] React Window is being re-written again by bvaughn, there are bugs in it currently, an
      afternoon to revisit and see if we can upgrade to that version

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
- need to refresh searchResults sometimes when youve added bits, dont do too smart just check for
  saves
- SelectableStore should export themselves into a global, based on if they are visibile, and then
  esc can clear selection before doing anything else

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

- make a generic app for search + display data that you can drag a query into make user manager app
  use grid layout probably make slack app search something large and put it into layout demo app or
  similar

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
