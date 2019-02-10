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
