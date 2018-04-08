## next

"the working & sexy af week aka young independent Orbit"

* MONDAY

  * ux
    * hover cards color like orbititem
  * themes
    * upgrade gloss themes a little:
      * title, subtitle, main text
      * fix themes passed into static theme are different structure
      * white and dark theme
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

  * correctness:
    * pin-on-click only when option holding
    * fix orbit not opening quickly after not using for a while
  * github sync
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

  * smoothness
    * fix unpin glitchy animation

* FRIDAY

## queued ux stuff

* OCR scanning - once its paused again it doesnt move wiht app anymore
* should use mouse angle to prevent unwanted accidental selects

## notes

* potential metrics to

  * saved time searching
  * saved contextual switches
  * time reduced in slack/email
