# needs to work for countdown to v0
  - Fix automagic getting stuck and not updating sometimes
  - Commander
    - variety of bugs and polish needed
    - doesnt always update to latest route
    - focus doc after navigate
  - Draft
    - placeholder "Enter your reply..."
  - Thread
    - Show dates on threads/replies
    - Create from draft + dropdown (does it open/close create nicely)
    - Replies
      - Show proper user
  - Keyboard basic fixes
    - Moving from commander/doc
  - Polish
    - Improve document saving so it saves more consistent
    - Document breaks with quotes etc
  - Technical
    - Query sync down needs to be fixed
  - Documents
    - the + button to side should become a "type switcher", so you can switch todo list to bullet, etc
    - Remove the alternative right arrow insert
    - Links to other docs
    - Code blocks?

# next
  - not be edit mode by default in threads unless you are author
  - archive/delete things
    - context menu for sidebar?
  - indexes still not working .sort('createdAt')
  - signup: asks for your team names + emails, then makes root pages for them
  - @mentions
    - @doc mention
    - @user mention
    - @thread mention
  - nicer inline due dates
  - fix keyboard nav
  - fix sync todos doc/sidebar
  - pullout of notifications
  - lightweight gdocs style inline comments too?

# polish
  - cant paste in rich content
  - no numbered lists
  - cant invite people with a link
  - no pasting/editing/adding links
  - images break on paste
  - save doesnt happen after many actions
  - outline of a doc view that shows just headers and links to them
  - no code blocks
  - blockquotes break on enter
  - lists dont auto-join together
  - doesnt always keep empty paragraph line at end of doc
  - sub-headings visibility
  - super basic tables
  - alignment
  - list and concept of who has joined a doc
  - font size choice
  - cant move things to other locations
  - revisions/history
  - pop out discussions into a new window so you can view side-by-side

# tech
  - needs to be a universal dragcancel thing that prevents clicks once you started dragging electron
  - see about pouch revisions
  - types not working on <Views prop={array | string} /> still

# high level prioritized list
  - attachments
  - documents
    - inserting and editing a link
    - linking between docs
    - inserting and editing an image
    - changing text alignment
    - changing text color/background
    - focused nodes (image, doclist) cursor fixes
    - realtime
    - history/revisions
  - deploy to prod
  - slack integration + avatars
  - drag/drop: list items
  - email forwarding
  - github sync
  - integrations

# bookmarks
  -fast pouch
    - https://github.com/redgeoff/delta-pouch
    - https://github.com/jkleinsc/telegraph
