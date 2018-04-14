ctrl + drag off

## review

monday

learned:

* electron 2.0
* webview / overflow scroll bounce
* Desktop.sendMessage(Electron, Electron.messages.MSG)
* orbitRef.hide() quickly
* Swindler dedupe animation improvements

fallover:

* peek positioning
* overdrive animation
* swift defocus bug still active

tues

fallover:

* createOrUpdate should return only if updated, can be used in syncers to output # changed
* peek needs to clear using messages
* use messages for current uses of state like shouldUpdate shouldHide etc

wed

* peek position limits more ofen fullscreen
* peek pos height adjust better

add:

* on resize window fixes
  * resize have it transition smoothly to fullscreen
  * back to corner
  * dont loose peek after move while pinned open

thurs

* meeting kevin
* option+key to pin

add:

* Primus error catching

fri

add:

* long tail: disable when super low battery
