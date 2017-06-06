goals:
  - get to bootstrappability
    - hosted iwritey.com instance we can use to plan
    - OMP working on sidebar
    - doc polish with todos

until its usable for myself:
  - import my notes from simplenote
  - production build so its fast
  - working links
  - fix overflow everywhere
  - another few days of general polish (stuff thats not polished:)
    - topbar
    - contextbar
    - private/public
    - links
    - images
    - movement in lists
    - indentation everywhere
  - login bugs

wants:
  - super fast nav:
    - cmd + t filter to move between docs
  - make use of pouch encrpytion - private docs! password protected?
  - focused nodes like image, doclist so i can delete and navigate w cursor
  - doc history (revisions view)

What slate is missing:
  - we need helpers for types of things:
    - "static" that doesnt let you delete it or change its type
    - "one-of-a-kind" that means onEnter it doesnt replicate
    - "one-liner" that doesnt let you insert more than a line inside

# next
  - db per ORG
  - fix motion 3s load delay
  - fix popover on user dropdown
  - dropdowns for bar, only show button per category
  - sidebar org mode
  - document todos two way sync

# email forwarding
# github forwarding
 - if it could auto compile a trail of your commits
 - show your last changes much faster

# grabbag

  - presence (whose viewing + cursor indicator)
  - comments (threaded)
  - quicker doc creation
  - linking between docs
  - @mention
  - fancy ml summarizer
  - integrations

# technical

- <Form /> which passes context to button
-    <Button /> which takes form context to add &:active style
- light theme by default
  - input, button, drawer, listitem, popover, text, title, ...
- move app logic to root stores
  - proper (user|auth|key|errors...) stores
- actions can be observed on any store
- make App a proper store
- give models their own manager that takes all options for couch
- move App into web
- split user/auth/errors stores into stores
- // somehow make app connect stores through actions

# emojis
https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json
https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json

slate/index.js at master · ianstormtaylor/slate
https://github.com/ianstormtaylor/slate/blob/master/examples/emojis/index.js

# hover intennt
- react-with-hover/with-hover.js at master · team-767/react-with-hover
  https://github.com/team-767/react-with-hover/blob/master/src/with-hover.js
- tristen/hoverintent: Fire mouse events when a user intends it
  https://github.com/tristen/hoverintent

# extract statics + sortable lists

motion_/extractStatics.js at 5d534f71d92048f0afaa1e2632d5727739490619 · motion/motion_
https://github.com/motion/motion_/blob/5d534f71d92048f0afaa1e2632d5727739490619/packages/transform/src/lib/extractStatics.js

motion_/Statement.js at 5d534f71d92048f0afaa1e2632d5727739490619 · motion/motion_
https://github.com/motion/motion_/blob/5d534f71d92048f0afaa1e2632d5727739490619/packages/transform/src/nodes/Statement.js

Drag and Drop between two different containers with different elements · Issue #542 · react-dnd/react-dnd
https://github.com/react-dnd/react-dnd/issues/542

experiments/sortable-target at master · rafaelquintanilha/experiments
https://github.com/rafaelquintanilha/experiments/tree/master/sortable-target

Multiple Sortable Targets
http://localhost:3002/
