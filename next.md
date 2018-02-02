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

* be able to always run those apps without trouble (debug perf and uptime)
* get dev experience to be good for both
* preconfigured with our integrations hardcoded / working
  * slack, google docs, github
  * twitter => slack, medium => docs
* easy way to cut prod builds that download
* highlights
* peek
* tray ux
* improve ocr
* sync attention
* feeds
* summarization ?
* ...

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
