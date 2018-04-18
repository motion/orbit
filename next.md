# new

* electron 2.0
* webview / overflow scroll bounce
* Desktop.sendMessage(Electron, Electron.messages.MSG)
* orbitRef.hide() quickly
* Swindler dedupe animation improvements
* meeting kevin
  * stripe scale, how would we solve it
  * hes interested in:
    * better seeing what teams are all about
    * better seeing the structure of the company
  * should follow up with him+mike in a couple weeks
  * he did mention calendar integration being interesting
  * linking notes to calendar meetings -- startups do this, could be simple
    * http://www.shellyapps.com.au/ see "our vision"

small polish

* design

  * OrbitCard
    * [ ] highlight vs active state - active is "clicked", hl should be current active
    * [ ] for icons - try result.integration + result.type first, fallback to result.int
    * [ ] peek scroll to different sub-sections in card

* indicator

  * [ ] design

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

- peek

  * click header input clear peek
  * peek auto link links
  * peek show images

- profiles

  * [ ] sync people info from google
  * [ ] sync people info from github
  * [ ] basic peek view with aggregate info + avatar
  * [ ] NLP: related things, common rooms

- sync

  * [x] need to normalize bitUpdatedAt and bitCreatedAt
  * [ ] github sync
  * [ ] github simple sidebar/peek

- settings

  * [ ] adjust setting based on storage size
  * [ ] easy automatic setting setup: common rooms, etc
  * [ ] remove setting + clear bits

- stack

  * [ ] fix electron devtools not working

- productionize

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

- research
  * [ ] keeping chromium warm
