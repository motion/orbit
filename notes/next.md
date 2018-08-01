- p2p https://github.com/mafintosh/hyperdb

- highlights click: doesn't toggle open/close peek
- peek: make "open" button work well
- relevant/recent toggle broke
- search: integration filters dont update search
- peek people: topbar needs a lot of visual work
- search: filtering "nick and nate" doesn't show any results for some reason
- horizontal related row at bottom of each peek bit for all of them
- horizontal info/updates row at top of each peek
- peekArrow: account for real header and dont overlap edges
- make all searches work: task search, message search
- Remove setting button
- Google drive settings pane
- Manage tab for every one:
  - Stats card of total bits
  - Clear all bits
  - Remove integration
  - Can have login settings if applicable

# unnecessary for beta polish bucket

- peek arrow position shouldn't straddle weird borders
- react-spring for peek placement
- styling on settings panes
- peek header styles
- settings panes fixes
- hoverGlow needs fix for x/left just like top/y
- @mcro/color: increaseContrast, decreaseContrast
- test-app: fix themes/tabs
- fix orbitdocked resizing/overflow logic
- roundbutton hover more contrast
- Person titlebar borderbottom is weird
- no titlabar faderight to transparent on profile
- UI.Text not wrapping subtitlePrefix

# gamechangers

-

- Super search within peek

  1.  make it so it also searches across related content within that integration
  2.  makes it feel like a powerful sub-search

- multiselect ?
  1.  search
  2.  hit shift + click
  3.  (or click and drag just like tableview)
  4.  it puts the results into tabs
  5.  drag away the window
  6.  now you have a grouped view
