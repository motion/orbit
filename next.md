## next

* MONDAY

  * cards
    * overdrive: deep investigate animate performance
    * dynamic sizing better with diff amounts of items
  * peek
    * try only show on click
    * clicked color state for cards
    * fix alignment vertically with cards
    * fix peekOnLeft not working when on right
  * performance
    * make "fast message" for clearing things as quickly as possible
      * dont use setState mechanics or json.parse etc just simple message
      * dont use react just message => change css property

* TUESDAY

  * slack sync
    * get working
    * group by time simply at first
    * slack conversation sidebar design
    * slack peek simple render
  * correctness
    * pin:
      * fix not focusing input on pin (option+space/doubletap doesnt focus input text)
      * sometimes app is defocusing when you let go of option when its already focused
        * happens when mouse is outside of all active areas including app window
    * fullscreen:
      * fix visual glitches
      * fix shadow at edges
      * fix highlight background not clearing
      * fix focus off not working
      * fix holding option after un-fullscreen bad state
    * docked:
      * fix visual glitches / shadow

* WEDNESDAY

  * google doc sync
    * google doc design
    * multiple section highlights:
      * hover to scroll to in peek
  * correctness:
    * pin-on-click only when option holding
    * fix orbit not opening quickly after not using for a while
  * search correctness:
    * avoid multiple renders on search
    * "gh" prefix to search integration
    * other way to pin, typing a character:
      * pin window and type char
      * show a banner saying "let go of option"
  * settings:
    * fix various bugs in selection
    * move settings icon somewhere nice
    * make oauth screen nice
      * remove auto click stuff
      * keep orbit pinned while in settings

* THURSDAY

  * github sync
    * design sidebar
    * simple peek
  * animation burst:
    * nice "in" animations on fullscreen
    * fix unpin glitchy animation
  * correctness:
    * fix hover over <Indicator /> to show sidebar
    * swindler fix not updating on some window resize/change
  * settings:
    * make various settings panes better
  * mini productionize
    * get builds working to .app
    * get auto update working
    * minimize builds to smaller size
    * see if can share chromium or delay download
  * mini onboarding:
    * on empty, open settings by default

* FRIDAY

  * review weeks work, do stuff based on that
  * jank reduction
  * planning:
    * for beta deploy
    * for user interviews
