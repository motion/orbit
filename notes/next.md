- p2p https://github.com/mafintosh/hyperdb

Goals end of Sep:

- Hire top frontender
- auto setup
- p2p sync with 2 real features (rate-limit, pin-to-search)
- deploy it with 5 teams
- alpha ocr/memory/contextual-search

Next:

- Aug 2nd - Filtering/search done
- Aug 3rd - Auto updating
- Aug 4th - Productionized
- Aug 6th - Auto setup:
  1.  startup orbit, nothing shows!
  2.  scans your chrome history
  3.  shows in Tray (Setting up Orbit...)
  4.  do exactly how fantastical gmail setup works
  5.  open chrome tab with the oauth already active (not button page)
  6.  at the end show a sucess notification
  7.  cycle to next integration to set up
  8.  once all done, open orbit and do a tour
- Aug 5th - Settings panes done
- Aug 6th - Details - tray menu, links, better search
- Aug 7th - Onboarding
  - Explain shortcuts
  - Invite friend card on home
- Aug 10th - simple p2p sync for dedupe gdocs
- Aug 13th - invite features
- Aug 14th - deploy to Matt
- Aug 21st - deploy to FOSSA
- Aug 30th - iterations based on Matt/Kevin install
- Sep 2nd - Website upgraded for beta
- Sep 10th - Article written

tonight:

- fix date filter interaction
- performance run on searching

thursday:

- search: filtering "nick and nate" doesn't show any results for some reason
- peekArrow: account for real header and dont overlap edges
- make all searches work: task search, message search
- Remove setting button

friday:

- peek use Meta bar
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
- hoverGlow needs fix for x/left just like top/y
- @mcro/color: increaseContrast, decreaseContrast
- test-app: fix themes/tabs
- fix orbitdocked resizing/overflow logic
- roundbutton hover more contrast
- Person titlebar borderbottom is weird
- no titlabar faderight to transparent on profile
- UI.Text not wrapping subtitlePrefix

# random dev notes

- hmr: doesn't store.unmount stores often
- react: await finishRender() could be interesting

# gamechangers

- calendar support
- index anything
- memory
- contextual search

# p2p features
