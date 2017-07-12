# housekeeping sunday
  - gloss already patches this.fancyElement
    - make that be the proxy getter duh
    - then just add module to class?
    - see black/patch.js
  - hmr bugs are still pretty bad, try and fix dup views and stale stores
  - popovers in actions area get "stuck" open
  - on signup create org + invite team + create home doc and onboard
  - see about pouch revisions

# next
  - follow thread vs edits vs tasks (toggle?)
  - double space === >
  - query sync down
  - new page auto follow + team follow
  - signup: asks for your team names + emails, then makes root pages for them
  - content prefill for new org
  - @mentions
  - discussions
  - homepage
  - nicer inline due dates
  - fix keyboard nav
  - fix sync todos doc/sidebar
  - pullout of notifications
  - feed
  - prod
  - lightweight gdocs style inline comments too?

# polish
  - docs dont scroll down properly
  - cant paste in rich content
  - no numbered lists
  - cant invite people with a link
  - todo indentation broken
  - no pasting/editing/adding links
  - images break on paste
  - save doesnt happen after many actions
  - outline of a doc view that shows just headers and links to them
  - no code blocks
  - blockquotes break on enter
  - lists dont auto-join together
  - doesnt always keep empty paragraph line at end of doc
  - sub-headings visibility
  - selectbar broken stuff
  - super basic tables
  - alignment
  - list and concept of who has joined a doc
  - font size choice
  - keyboard shortcuts

# nate
  - want to start keeping notes on things i want to see
    - visit/england (visit/england/london), visit/india, etc
  - installing from npm is a pain
  - indexes still not working .sort('createdAt')
  - types not working on <Views /> still
  - rxdb query sync broken https://gitter.im/pubkey/rxdb

# high level prioritized list
  - @mentions / dates
  - hashtags ?
  - statuses ?
  - comments
  - attachments
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
  - drag/drop: list items + sidebar
  - drafts
  - email forwarding
  - github sync
  - newsfeed
  - templates
  - integrations

# bugs
  - needs to be a universal dragcancel thing that prevents clicks once you started dragging electron

# ideas
  - pop out discussions into a new window so you can view side-by-side

# fast pouch
- https://github.com/redgeoff/delta-pouch
- https://github.com/jkleinsc/telegraph

motion_/extractStatics.js at 5d534f71d92048f0afaa1e2632d5727739490619 · motion/motion_
https://github.com/motion/motion_/blob/5d534f71d92048f0afaa1e2632d5727739490619/packages/transform/src/lib/extractStatics.js

motion_/Statement.js at 5d534f71d92048f0afaa1e2632d5727739490619 · motion/motion_
https://github.com/motion/motion_/blob/5d534f71d92048f0afaa1e2632d5727739490619/packages/transform/src/nodes/Statement.js

Drag and Drop between two different containers with different elements · Issue #542 · react-dnd/react-dnd
https://github.com/react-dnd/react-dnd/issues/542

experiments/sortable-target at master · rafaelquintanilha/experiments
https://github.com/rafaelquintanilha/experiments/tree/master/sortable-target
