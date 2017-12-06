# done

* Assemble 5 good knowledgebases to test on from Zendesk/Intercom/other
  * custom - https://www.dropbox.com/help/security/recover-deleted-files-folders
  * intercom -
    https://docs.expensify.com/setup-for-submitters/day-1-with-expensify-submitters
  * shopify (zendesk?) - https://help.shopify.com/manual/apps
  * groupon (old zendesk? pure js) - https://www.groupon.com/faq
  * uber (zendesk?) -
    https://help.uber.com/h/6949160d-3eb6-42cd-8155-1ae3cf25be0b
  * zenefits -
    https://help.zenefits.com/Medical_Dental_Vision/Learn_About_Health_Insurance/Qualifying_Life_Events/01-Common_Qualifying_Life_Events/
* oauth window
  * click the link after load
* thing: safety on syncing the same url
* oauth: clean up after cancel/confirm
* height adjustment based on results
* pin banner ux improvements
* bug: home showing recent
* via [S] #general

# now

* thing: show where it came from
* scan hard drives for files (word pdf excel)
* cmd+opt when unfocused: focus + focus search
* cmd+opt when hidden: focus + focus search
* cmd+opt when focused: hide
* fix drill in from home/item to not just use context
* settings pane: bottom sync status tray (slack, github, drive)
* settings pane: better sync button
* settings pane: crawler section
* slack sync
  * turn off a room it should disable/delete attachments
  * showing slack icons next to slack things + data.channel
* cancel crawl from crawling... pane
* crawling... pane glitch when on home
* tests and fixes on drive/github
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
