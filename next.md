# macro

## Stack retooling

Likely not ready to pull trigger here yet: need to wait to see a couple more things shake out:

* Webpack 4 release
* Babel 7 release
* See if Yarn workspaces get better in meantime (to decide on Rush vs Yarn)

This is ambitious only because getting it fully to build in prod while still retaining our dev tools is quite a bit. You need things to compile in dev mode to have HMR wrappers and helpers, and then separately compile a "dev" mode for server without those, and finally a "prod" mode for things that is stripped down (only for packages, I think).

* Lerna => Rush (solves some linking things problems)
* Babel 6 => Babel 7 + TS
* Pundle => Webpack 4
* Simplify bin/\* and building
* Rewrite various packages for TS
* Helpers ++ Path == electronUtil.fixPathForAsarUnpack(dirname)

# micro

* Ingest:
  * Knowledgebase
  * Slack
  * Drive
  * Github
* Focus:
  * Research into OCR on screen for anything
  * Intercom/Zendesk last messages
  * Slack last message
* Onboarding:
  * simple next/back onboarding pane
  * steps:
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
* Beta:

  * test bundle onboarding process
  * super basic onboarding window
  * token refreshing

* prod build is downloading even if its older version
* prod build is much bigger now
* working crawl of deliverx kb
* better icons
* crawler dont use node readability
* more forgiving markdown parser
* drive sync pane / drive sync
* settings pane: sync status improvements
* slack: turn off room it should disable/delete attachments
* have a poll that checks crawler status so it always shows a status drawer and
  you can cancel
* cmd+opt when unfocused: focus + focus search
* cmd+opt when hidden: focus + focus search
* cmd+opt when focused: hide
* cancel crawl from crawling... pane
* crawling... pane glitch when on home
* crawler breaks on lots of sites due to html parser, do readabiltiy injection
* peek window that tracks next to main window
* peek window shows peek view of items
* feature: on window focus make ora show if hidden (clicked dock / task switch)
* resizing the window (height)
* show body contents snippet when on thing
* bolding inside ui.text for highlighting key words
