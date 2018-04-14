on fs focus input

## review

monday

learned:

* electron 2.0
* webview / overflow scroll bounce
* Desktop.sendMessage(Electron, Electron.messages.MSG)
* orbitRef.hide() quickly
* Swindler dedupe animation improvements

fallover:

* overdrive animation

wed

* peek position limits more ofen fullscreen

add:

* on resize window fixes
  * resize have it transition smoothly to fullscreen
  * back to corner

thurs

* meeting kevin

add:

* Primus error catching

fri

add:

* long tail: disable when super low battery
* long tail: bridge both setState and receiveState should batch a tiny bit
  * if multiple setstate called before settimeout, group them
  * if multiple recevied before timeout, group them
