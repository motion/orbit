needs for release:

# design

- Search app
  - choose filters
- List app
  - choose sources
  - choose editable
  - choose sortable
- Trend app
  - choose sources
  - choose editable

# technical

## development

- app pane that shows active apps and lets you search for new ones
- "create new" option within that pane
  - name, icon
- insert db entry, create a folder for it
  - may want a configuration setting in settings pane for folder location
- once selected on app
  - "start development"
    - starts a webpack-dev-server
    - opens a new app window with just that app open
    - that window should start with dev console open
- that app comes from a templated app it copies in
  - can copy to `~/Apps/myapp`
  - needs to import `~/Apps/.orbit/index.ts*` package
- below the app show an extra bar
  - "Save"
- could have a cli that accompanies
  - orbit new
  - orbit dev

## architecture

- need orbit package with apis
- need permissions for data access stuff (v1.1)
- need documentation for how to use and build, apis
- need some example apps

## release

- need a server
  - deploy endpoint
    - accepts versions (git based?)
  - search endpoint
  - download ability

## design

- orbits dock icon can be a "fake" one from the swift sub-process
  - this lets us control its order in the focus!
  - which is good because you _dont_ want it mucking up recent icon sort order every time you use it
- we can pre-package the app icons with orbit for use in dock
  - there can only be one instance of each app!
    - so that means we dont need infinite icons
