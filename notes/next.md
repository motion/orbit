# monday

- search key movement move frame
- peek fix highlights delay bug
- sub-search fixes
- permalinks in peeks
- location links in search results working

- big bug: css styles that don't end well cause problems in all styles lol... basically can do css xss
  - `linear-gradient(to right, white, black`

# sunday:

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

# peek search/display run

- horizontal related row at top of each peek bit for all of them
- make all searches work: task search, message search

# interaction run

- need good solution for key move past ends of search results
- peek arrow position shouldn't straddle weird borders

# smaller visual bugs

- if you have a search entered and hit "settings" it breaks
- hover effects on home button odd / stay around after hide/show
- hovering terms on homescreen -- remove for now
- selected state of searchBar in peek should glow and help bring focus there

# settings run

- Remove setting button
- Google drive settings pane
- Manage tab for every one:
  - Stats card of total bits
  - Clear all bits
  - Remove integration
  - Can have login settings if applicable

* decorators/HOC: https://github.com/Microsoft/TypeScript/issues/4881, https://github.com/DefinitelyTyped/DefinitelyTyped/issues/9951 https://stackoverflow.com/questions/39026224/how-to-compose-multiple-typescript-class-decorators
* p2p https://github.com/mafintosh/hyperdb
* hire https://github.com/theKashey
* ide https://retool.in/
* icons https://danklammer.com/bytesize-icons/
* nlp/filters https://github.com/NaturalNode/naturalhttps://github.com/spencermountain/compromise/wiki https://github.com/laconalabs/elliptical

# gamechanger ideas:

- multiselect:
  1.  search
  2.  hit shift + click
  3.  (or click and drag just like tableview)
  4.  it puts the results into tabs
  5.  drag away the window
  6.  now you have a grouped view
