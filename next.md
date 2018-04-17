# new

* electron 2.0
* webview / overflow scroll bounce
* Desktop.sendMessage(Electron, Electron.messages.MSG)
* orbitRef.hide() quickly
* Swindler dedupe animation improvements
* meeting kevin
* long tail: disable when super low battery
* long tail: bridge both setState and receiveState should batch a tiny bit
  * if multiple setstate called before settimeout, group them
  * if multiple recevied before timeout, group them

- indicator

  * [ ] design

- sidebar

  * [ ] design better info display for items, better meta info
  * [ ] slack: sync People, Chat Rooms
  * [ ] list: movement + animations + keyboard/scroll select orbit list
  * [ ] overdrive: deep investigate animate performance

- positioning

  * [ ] swindler fix not updating on some window resize/change

- fullscreen

  * [ ] nice "in" animations on fullscreen
  * [ ] fix last glitches on out/animation
  * [ ] make peek + orbit show at same time
  * [ ] on fs focus input
  * [ ] accidental fullscreen at times

- profiles

  * [ ] sync people info from google
  * [ ] sync people info from github
  * [ ] basic peek view with aggregate info + avatar
  * [ ] NLP: related things, common rooms

- sync

  * [ ] need to normalize bitUpdatedAt and bitCreatedAt
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

- research
  * [ ] keeping chromium warm
