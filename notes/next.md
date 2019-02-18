Meeting with kdy:

- Fix adding to lists, set up a nice lists app
- Fix lists drilling down
- Show better configuration screen for new app
- Make a fake "app code folder" with app in it
  - Have it just symlink to the custom app folder!
  - Can actually demo app editing in a video :)

---

post demo:

- need to get umed on a solid path towards helping with custom apps
- then need to work through towards a beta launch end of March
  - onboarding
  - app configuration and app polish
  - p2p story / space story, solid design in place and some implemntation

---

Goal by end of February - deployable alpha 2

Strategy: work up to it "Start to Finish", so basically start with the very first thing they will see, and move towards the last thing they need to use the Alpha.

So,

1. Onboarding
   1. Setup with Github
   2. Create your Space step
   3. Design a better explanation before you go in app
2. Guided intro
   1. Just do minimal version
      1. Setting up a space
      2. Creating a new app
3.

data sync story:

- code/spaces: github
- keys/configs: initially github, but move to bittorrent-dht (step 2)

prioritized:

- get custom apps working ~2 weeks
- get space management working ~2 weeks
- get p2p or git based sync of apps working ~2 weeks
- build website ~4 weeks
- build docs ~4 weeks
- go sell it ~~~

nate:

- add people to search
- fix popovers when scrolled down
- create space pane
- edit space pane
- fix onOpen
- fix send submenu

- keep current items in memory and just filter them on search by title (not fuzzy just match subsection)
- Opening, movement fixes
- Submenu for items to favorite or pin to a list
- manage space pane: upload your image / name it / CRUD
- manage account pane: same sort of deal... + link to slack
  fix search results: open on enter, onOpen broke
  fix tab drag index
  actions menu

---

Next:

Search/filtering refactor:

- overmind
- generic filters for every app
- redo queryfilter/search filter stuff
- support: in:github label:x, etc

Next:

- research using google drive + slack as a file store then we can be all local.
- create new app pane (cnap)
- cnap - permission on who can see it
- can we store auth stuff inside the auth integration itself?
- otherwise we can have our cloud by default
- Use firebase
- but let them deploy their own on prem if they ask
- and just built the docker on prem stuff once they ask for that
- create new app from search
- custom app development stuff
- look at fb flipper. Building their own development tools may be interesting. Like a special debugger or something.

---
