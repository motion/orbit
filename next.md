* interaction

  * if click input on preview, pin it
  * disable drag peek in fullscreen
  * keyboard nav
    * right/left to open big-peek

* ux

  * get better docs in place for peek design
  * peek document display/design
  * bottom of tray "mini peek" that previews hovered result
    * then click does big-peek

* bugs

* fullscreen ux bugs:
  * disable both from animating on open
  * can see it transform back to sidebar on close
  * disable drag
  * certain windows/actions confuse swindler

# old

* highlights window needs to ensure its full screen every so often (display changes mess it up)
* handle token refreshing
* sync should handle disabling in a consistent manner
* onboarding
* prod build is downloading even if its older version
* prod build is much bigger now
* hydrating a store should check if initial states changed, and then use new default state if so
