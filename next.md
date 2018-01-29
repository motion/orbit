## next

* fix i's j's by going continuing downwards from middle of found outline
  * needs: skipping bottom black
* fix recognition
  * dont crop/contain just center and scale down
    * think: apostrophe vs comma, period vs middot, 0 vs o, l vs 1
  * swap numbers in words by if prevword is letter then swap using simplenumtoletterdict
  * train with more deversity

## functionality

* focus an area using your mouse + option
* investigate downsides of option+hold and other strategies
* highlight sentence you are focused on
* focus: intercom/zendesk type apps testing

## polish

* working crawl of deliverx kb
* crawler dont use node readability
* more forgiving markdown parser
* drive sync pane / drive sync
* settings pane: sync status improvements
* slack: turn off room it should disable/delete attachments
* cancel crawl from crawling... pane
* crawling... pane glitch when on home
* crawler breaks on lots of sites due to html parser, do readabiltiy injection

## token refreshing

should research if were screwed by this especially re: google
should handle token refreshing

## better data syncing structure

each window should sync its respective focus/blur/position from electron to the window itself
should not sync stuff through electron but through api/socket
should have ability to sync diff logical groups across on their own

## syncers v2

should handle disabling in a consistent manner
should be able to cancel/restart crawls
should be able to see

## first time UX

* should have a pane that shows back/next
* should show steps:
  * 1. Welcome to Orbit, we need to setup integrations
  * 2. We work with your browser, navigate to your knowledgebase in Chrome
    * Open ora window that welcomes them, instructs them to go to
      knowledgebase
    * Ora needs to detect when they enter a Intercom/Zendesk/etc knowedgebase
    * Have "Add this site" button glow for them
    * Should show some nice stats on estimated time, etc
    * Once they start first crawl it shows status, re-focuses the onboarding
      window:
  * 3. You can also Pin individual sites
  * 4. Keyboard shortcuts / search / usage generally
  * 5. Done! Tweet/email us easily here

## prod builds

should fix various production build issues

* prod build is downloading even if its older version
* prod build is much bigger now
