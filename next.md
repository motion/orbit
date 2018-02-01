# next

## Pitch

A smart app that keeps you up to date. Defines things as you go,
lets you search and see whats happening based on what you care about.
Powered by what people pay attention to.

## Features

* Links in all your cloud services
* Tracks you/your teams attention
* Search everything w/ Attention Rank + NLP
* Automatic-help: highlights important words/phrases as you work w a great feed
* Up to date: (What you care about - what you've seen) using Attention

## Strategy

* Always be integrating: we need to get a feel for it
* Need to get simplest versions of each feature working, then iterate
* Our integrations (github, slack, docs) + mock data (twitter, medium, external github)
* Our apps should always be in sync, in prod mode, running our both our CPUs so we can discuss
* Every goal along is only complete once we integrate the test/revision into prod app

## Steps

* prod app comes preconfigured with our integrations hardcoded and working
  * slack sync all our conversations into the feed
  * make sure google docs / github are syncing well + hardcode a few
  * add mock data sources (twitter => slack, medium => docs)
* have easy process to cut production builds that update on both our computers auto
* be able to always run those apps without trouble (debug perf and uptime)
* get base features working (basic highlights + peek + interaction with tray smooth)
* debug the OCR system so we can keep it running at all times without problems
* sync attention data between our clients
* improve the UX so the app feels good, doesnt crash, and tracks various apps well
* iterate on the feed to make it more helpful until were happy
* summarize items for notifications nicely
* then get more real integrations working and iterate on everything

## Micro

* fix bad lines
* check after move if it hasnt changed
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
