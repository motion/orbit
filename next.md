## next

* [x] slack long convo (... + x more display at bottom)
* [x] peek design (share resolver that gets info)

Make App Feel Buttery Again

* [ ] list: granular re-render on index change
* [ ] make "#" show a list of slack rooms
  * [ ] search "#gen some" searches #general filtered by some
* [ ] make "@" show a list of slack people
* [ ] search people directly
* [ ] attachments/images handled in resolver
* [ ] make the homepage just opacity 0 during searches, so it comes back more quickly when empty
* [ ] on searches, when typing a new char, make opacity go down on current results until new ones show (feels much better)

## next next

* interaction

  * [ ] when docked, dont hide during window move

* sidebar

  * [ ] icon improvements (gmail, gdocs)
  * [ ] overflow title flicker on expand
  * [ ] list: animations between active
  * [ ] better fill to height when not having many results
  * [ ] default view: your day -- how it shows various things, grouping, etc
    * [ ] upcoming, haven't seen

* slack

  * [ ] cosal keywords for convo

* design

  * OrbitCard
    * [ ] highlight vs active state - active is "clicked", hl should be current active
    * [ ] for icons - try result.integration + result.type first, fallback to result.int
    * [ ] peek scroll to different sub-sections in card

* indicator

  * [ ] design

* smoothness

  * [ ] re-focus app after animation finish (when not holding option)

* sidebar

  * [ ] click to link to the Bit
  * [ ] design better info display for items, better meta info
  * [ ] slack: sync People, Chat Rooms
  * [ ] list: movement + animations + keyboard/scroll select orbit list
  * [ ] overdrive: deep investigate animate performance

* positioning

  * [ ] swindler fix not updating on some window resize/change

* fullscreen

  * [ ] nice "in" animations on fullscreen
  * [ ] fix last glitches on out/animation
  * [ ] make peek + orbit show at same time
  * [ ] on fs focus input
  * [ ] accidental fullscreen at times

* peek

  * [ ] click header input clear peek
  * [ ] peek auto link links
  * [ ] peek show images

* profiles

  * [ ] sync people info from github
  * [ ] sync people info from google
  * [ ] peek view with aggregate info
  * [ ] NLP: related things, common rooms

* sync

  * [ ] github sync
  * [ ] github simple sidebar/peek

* settings

  * [ ] adjust setting based on storage size
  * [ ] easy automatic setting setup: common rooms, etc
  * [ ] remove setting + clear bits

* stack

  * [ ] fix electron devtools not working

* productionize

  * [ ] get builds working to .app
  * [ ] get auto update working
  * [ ] minimize builds to smaller size
  * [ ] see if can share chromium or delay download
  * [ ] check small screen, big screen, change screens
  * [ ] long tail
    * disable when super low battery
    * bridge both setState and receiveState should batch a tiny bit
      * if multiple setstate called before settimeout, group them
      * if multiple recevied before timeout, group them

* research

  * [ ] keeping chromium warm
