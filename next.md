# next

"shared highlights"

ux

easy highlight words non-contiguous and see search

* Combine screen + swindler so can use GPUImage/...
* hold option to see highlights
* quick clear using key events
* debounce more when it notices lots of changes (video)
  * ideally, remove areas that keep changing, just scan rest

correctness

* line finding (hough transforms gpuswift?)
* recurrent net corrections
* experiment: swirly bits for convnet
* long line/char finding breaking

fun

* ux roll through for option show fixes
* hover to see line/sentence highlight
* exact character matching
* preconfigured with our integrations hardcoded / working
  * slack, google docs, github
  * twitter => slack, medium => docs
* prod builds
  * fix port overlap issues
  * get it building again
  * easy script to cut them
* highlights
* peek
* sync attention
* feeds
* ...

## Micro

* highlights needs to ensure its full screen every so often (display changes mess it up)
* peek bugs popping up all the time
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
* hydrating a store should check if initial states changed, and then use new default state if so
