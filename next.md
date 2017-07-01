# nate
  - UI.Menu => UI.Popover + UI.List
  - watch should watch package.json files and re-run lerna bootstrap there
  - CommanderStore.crumbs is coming back as mobxarray not plain array
  - breadcrumbsstore log is happening on keystores
  - indexes still not working .sort('createdAt')
  - types not working on <Views /> still
  - rxdb query sync broken https://gitter.im/pubkey/rxdb
  - ui kit:
    - sizing() some sort of size kit to handle all sizing
    - <Surface height={1} rounded chromeless gloss clear />
      - Derive Button, Input, ListItem

# high level prioritized list
  - inbox
  - signup: create team flow
  - @mentions / dates
  - hashtags / statuses / comments / attachments
  - homepage
  - documents
    - inserting and editing a link
    - linking between docs
    - inserting and editing an image
    - changing text alignment
    - changing text color/background
    - focused nodes (image, doclist) cursor fixes
    - realtime
    - history/revisions
  - keyboard shortcuts
  - deploy to prod
  - slack integration + avatars
  - ideas
    - drag/drop on sidebar (todos and sections)
    - drafts
    - email forwarding
    - github sync
    - newsfeed
    - attachmentsbox
    - grids
    - templates

# next
  - #brainstorm: features and user feedback strategy
  - editor: node helpers:
    - "static" that doesnt let you delete it or change its type
    - "one-of-a-kind" that means onEnter it doesnt replicate
    - "one-liner" that doesnt let you insert more than a line inside
  - integrations
  - ui
    - standard props across all themes w rythm, margin/padding, ...
      - mb, mx, my, m, p, height, width
      - just a niceStyle() helper used in every theme()
    - add View
      - see react grid experiments from hn not long ago
  - gloss
    - $$background, $$border as way of attaching theme parent styles to els? and use theme={} props for almost all styles
    - turn theme="string" into theme={{ resolved: theme }}
      - lets you use theme inside render() for stuff like <Icon color={theme.color} />
    - allow passing theme objects directly to "tweak" styles theme={{ background: 'red' }} (works with ui niceStyle stuff)
      - this is like a local override of specific things
      - also allows cool themeing, so <Title /> and then InlineTitle = <Title theme={{ borderBottomSize, etc etc }} />
    - add color adjustment objects so no need for outside lib:
      - { background: { color: 'red', lighten: 0.5, alpha: 0.1 } }
        - could have references?:
          - { background: { color: '.color', lighten: 0.5, alpha: 0.1 } }

# fast pouch w workers
- https://github.com/jkleinsc/telegraph

motion_/extractStatics.js at 5d534f71d92048f0afaa1e2632d5727739490619 · motion/motion_
https://github.com/motion/motion_/blob/5d534f71d92048f0afaa1e2632d5727739490619/packages/transform/src/lib/extractStatics.js

motion_/Statement.js at 5d534f71d92048f0afaa1e2632d5727739490619 · motion/motion_
https://github.com/motion/motion_/blob/5d534f71d92048f0afaa1e2632d5727739490619/packages/transform/src/nodes/Statement.js

Drag and Drop between two different containers with different elements · Issue #542 · react-dnd/react-dnd
https://github.com/react-dnd/react-dnd/issues/542

experiments/sortable-target at master · rafaelquintanilha/experiments
https://github.com/rafaelquintanilha/experiments/tree/master/sortable-target
