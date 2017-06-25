# nate
  - alt ui: app vs tray, tray shows current sidebar, app has own sidebar with inbox style?
  - rxdb query sync (pending: https://gitter.im/pubkey/rxdb | https://github.com/pubkey/rxdb/blob/master/src/RxCollection.js)
  - commander features/polish
  - popover: unhover and rehover again not working userdropdown
  - sidebar favorites colors
  - favorite icon
  - share link dropdown
  - ui kit:
    - sizing() some sort of size kit to handle all sizing
    - <Surface size={1} rounded chromeless gloss clear />
      - Button uses Surface
  - gloss: <Button labelStyle={this.$labelStyle} /> syntax

# high level prioritized list
  - team homepage: commander force opened + showing expanded stuff
  - commander/filter/bar
  - document: images, links, dropdown menu + inline menu fixes
  - node keyboard toggle item type
  - signup: create team flow
  - deploy to prod
  - slack integration + avatars
  - comments

# next
  - @query not necessary (?)
  - #brainstorm: features and user feedback strategy
  - editor: performance/stability: general perf, less saving: save only on debounce(1000)
  - editor: realtime (see // TODO: for realtime sync)
  - editor: formatting: #uxlove + #dev
    - inserting and editing a link
    - inserting and editing an image
    - changing text alignment
    - changing text color/background
  - editor: lists:
    - todo lists: #dev
      - #hashtags, @due-dates, @users
    - doc lists:
      - #uxlove
  - release: deploy to iwritey.com get working
  - sidebar: #uxlove
  - sidebar: drag and drop between lists #big
  - drafts: #uxlove
  - sortable sidebar items

# queue
  - investigate multi-list drag/drop (react-sortable-hoc has this now in branch)
  - get to bootstrappability
    - hosted iwritey.com instance we can use to plan
    - OMP working on sidebar
    - doc polish with todos
  - until its usable for myself:
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
  - we need helpers for types of things:
    - "static" that doesnt let you delete it or change its type
    - "one-of-a-kind" that means onEnter it doesnt replicate
    - "one-liner" that doesnt let you insert more than a line inside
  - sidebar org mode
  - document todos two way sync
  - cmd + t filter to move between docs + create
  - private encrpytion
  - focused nodes (image, doclist) cursor fixes
  - doc history (revisions)
  - email forwarding
  - github forwarding
  - if it could auto compile a trail of your commits
  - show your last changes much faster
  - presence (whose viewing + cursor indicator)
  - comments (threaded)
  - quicker doc creation
  - linking between docs
  - @mention
  - fancy ml summarizer
  - integrations
  - light theme defaults
    - input, button, drawer, listitem, popover, text, title, ...

# gamechanger/showstopper (?)

  - well done attachments
    - do people think of docs as just part of a more general company filestore?
    - does it help people "get it" or does it clutter

# libs

- ui
  - standard props across all themes w rythm, margin/padding, ...
    - mb, mx, my, m, p, height, width
    - just a niceStyle() helper used in every theme()
  - add View
    - see react grid experiments from hn not long ago

- gloss

  - per-prop theme:
    - borderBottom: theme => [1, theme.borderColor],
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

# emojis
https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json
https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json
https://github.com/ianstormtaylor/slate/blob/master/examples/emojis/index.js

motion_/extractStatics.js at 5d534f71d92048f0afaa1e2632d5727739490619 · motion/motion_
https://github.com/motion/motion_/blob/5d534f71d92048f0afaa1e2632d5727739490619/packages/transform/src/lib/extractStatics.js

motion_/Statement.js at 5d534f71d92048f0afaa1e2632d5727739490619 · motion/motion_
https://github.com/motion/motion_/blob/5d534f71d92048f0afaa1e2632d5727739490619/packages/transform/src/nodes/Statement.js

Drag and Drop between two different containers with different elements · Issue #542 · react-dnd/react-dnd
https://github.com/react-dnd/react-dnd/issues/542

experiments/sortable-target at master · rafaelquintanilha/experiments
https://github.com/rafaelquintanilha/experiments/tree/master/sortable-target

# file management type views
- hashtags?
- or nice grid with dnd?

# templates
- useful with blocks
- right click => use template / define as new template
