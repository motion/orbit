# demo video

DeliverX

1. search: three terms that show off indirect results + integrations

* "education" => GDocs
* "samsung help button bug" => "samsung cant hit help button" issue
* "restuarant list" => "vendor list" intranet

2. Incoming email

* "Thoughts on adding fast food?"
* context shows:
  * McDonalds discussion slack
  * Hit copy link to paste into email
* Reply with link to discussion
* [mention: If someone adds a fast food section later we'd see it in context ]

3. Works w your data:

* [I'm a customer support manager so I want to be sure to add our knowedlgebase]
* Crawl DeliverX knowledgebase
* [But I also want to add in this map for my area, the SF municipal construction
  map]
* Pin SF municipal construction map

4. Focus works while you chat

* a. Customer sends a message on Zendesk
* b. They ask about their delivery
* c. We see automatically pinned their section in intranet
* d. Pull that section out of peek window to reference later
* e. "The driver is late"
* f. We see the driver route via window in (c)
* g. Hover to construction map in (3c) see theres a lot in his area
* h. "My apologies it looks like he's in an area with bad traffic, I'll contact"
* i. "We'll take care of this for you to your satifsaction"
* j. customer is nice but mildly annoyed, mentions "20 minutes late"
* k. Entry comes into context "Late delivery customer policy"
* l. Hover over entry, it highlights the table for 15-20m late, shows "offer
  credit $15"
* ...

# now

* flicker/movement on search
* list: fix scrolldown on pane height adjust bug
* peek: better behavior based on mouse activity
* peek: hide on scroll
* peek: adjust for scroll
* peek: tearaway
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

- Ingest:
  * Knowledgebase
  * Slack
  * Drive
  * Github
- Focus:
  * Research into OCR on screen for anything
  * Intercom/Zendesk last messages
  * Slack last message
- Onboarding:
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
- Beta:
  * test bundle onboarding process
  * super basic onboarding window
  * token refreshing
