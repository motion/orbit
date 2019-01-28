# Sprint 1

Goal: Make progress on apps, syncers, and account so we can deploy it in beta.

## Make teams, apps, and sources all work for production

@umed

Needs:

1. as a user i can deploy new apps to my team
2. as a user i can deploy a new source to my team
3. as Orbit we can deploy new apps/sources to end-users with ease
4. (in the future) as a user i can release a new app or source that any other use can install (app store)

TODO (high level):

1. Clean up settings/syncers bugs
2. we need to have the account/team system setup
3. Figure out architecture for syncers/apps to cover Needs 1/2/3

TODO (broken down):

1. Fix a few small bugs and type issues I've run into (see #bugs)
2. Finish bugs in syncers (see #syncers)
3. Develop account/team system (see #account)
   1. sign up and create team (Orbit Team)
   2. invite each other to join team
   3. see each others sources/apps
4. Set/test way for us to push updates to Orbit via the cloud
   1. We _could_ keep the current electron update system, which would be clunky
   2. Or we could look into having a system to download/patch the app JS files in place
      1. (we should see if it exists already)
5. Build a test new source and deploy it
6. Do the same for apps

---

## Finish the lists app, people app, and designs for various panes

@nate

Needs:

1. orbit basically needs to function well day to day

TODO (high level):

1. Make Search, Favorites, People, and Lists apps work pretty well
2. Fix and finish the Account, Settings, Sources, Apps management panes
3. Continue to get the Menu working enough to be testable

TODO (broken down):

_Search_

- Opening, movement fixes
- Submenu for items to favorite or pin to a list

_Favorites_

- manage space pane: upload your image / name it / CRUD
- manage account pane: same sort of deal... + link to slack
  fix search results: open on enter, onOpen broke
  fix tab drag index
  actions menu
  add people to search
  fixing tray/menu display and interaction
  restore menus a bit just actions dropdown + search
  get ocr hooked into menu enable/disable and output results
  get ocr => memory simple list

---

#backend

- it would be nice to have the initial model setup and general model creation better:
  - CreateUser command
  - CreateSpace command
  - having it so we can write it in a way where if we change the schema everything updates

#bugs

- make Store.props automatically type in useStore.ts
- loadOne/observeOne commands are being resolved by both syncers and desktop from client calls
  - this should just go from client => desktop right?
- settings panes
  - run over and fix them, a lot of breaking things like github not loading repos
  - can add "enter" key shortcut to toggle selection in table
- issue with reporting errors in observable queries, they are unhandled/not sent upwards
  - "Desktop: Possibly Unhandled Rejection: Wrong arguments supplied. You must provide valid options to findOne method."
  - "at EntityManager.findOne (/Users/nw/projects/motion/orbit/app/orbit-desktop/node_modules/typeorm/entity-manager/EntityManager.js:449:16)
    at /Users/nw/projects/motion/orbit/app/orbit-desktop/src/observer/QueryObserver.ts:78:45
    at new Subscription"
    #account

sorting by prepping to split out work as best possible:

- figure out account management
  - need some way to sync
  - have to beat this:
    - you get your own account via just email
    - once you enter email and add ONE integration, we can link them
    - perhaps just limit to slack/google first
    - that way we can store email + integration for next time you sign in
    - then we can provide a way to invite your teammates down the road
  - allow teammates option from your master to "join" the space automatically
  - give an invite code to the first person

#syncers

- on process exit it should clear all processing Jobs
- general:
  - syncers no longer seem to run once you add them, you have to hit refresh
- slack:
  - re-syncs seem to be doing a lot of work, can we improve incremental
  - for some reason my slack never synced for me, check to be sure it syncs reliable
  - seems like People arent showing the slack conversations on their profile
- github syncer and drive syncer not showing anything in their setting pane
- syncers arent running after first adding them
- crawler doesn't seem to handle links in slack for me, it was timing out / not syncing
  - perhaps we need better checks for that
- github smart sync shouldn't sync everything, just recent stuff
- got an out of memory issue during multiple syncs:
  - command:setting-force-sync:gmail:3 updating last cursor in settings {cursor: "11381717841944942365"}
- debug why gdrive syncer items show "empty" in frontend and clean that view up
- gmail:
  - syncer bodies are getting cut off early when they are just text, for example i see one where it just shows the first two sentences but nothing else
  - email formatting looks odd for quite a few, investigate how to format it properly and fix some common issues
