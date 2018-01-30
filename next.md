## next

* discuss
  * summarizing
    * chunking slack conversations (use topic models?)
    * summarize convos to one short sentence each
* tech
  * fix flicker loop
  * fix bad lines
  * check after move if it hasnt changed
  * debug slow char fetching after a few loops
  * make clearing quicker
  * fix i's j's by going continuing downwards from middle of found outline
    * needs: skipping bottom black
  * recognition
    * dont crop/contain just center and scale down
      * think: apostrophe vs comma, period vs middot, 0 vs o, l vs 1
    * swap numbers in words by if prevword is letter then swap using simplenumtoletterdict
    * train with more deversity
  * highlight lines on screen
  * bugs moving between apps/clearing ocr etc
  * polish hovering over words
  * peek bugs popping up all the time
  * clearing boxes quickly
  * clearing boxes granularly
  * highlight sentence you are focused on

# later

* crawler dont use node readability
* more forgiving markdown parser
* drive sync pane / drive sync
* settings simplify (iphone style app tray?)
* sync status improvements
* slack: turn off room it should disable/delete attachments
* cancel crawl from crawling... pane
* crawling... pane glitch when on home
* crawler breaks on lots of sites due to html parser, do readabiltiy injection
* handle token refreshing
* socket sync simpler architecture/code improvements
* sync should handle disabling in a consistent manner
* sync should be able to cancel/restart crawls
* onboarding
* prod build is downloading even if its older version
* prod build is much bigger now
