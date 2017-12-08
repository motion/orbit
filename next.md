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
* thing: show where it came from

# demo video

DeliverX

1. Universal smart search results
2. Incoming email w context
3. Copy/look at result to answer
4. Add DeliverX knowledgebase
5. Maybe pin the map intranet page
6. Intercom/zendesk chat w customer 1
7. Answer using peek map/knowledgebase combo
8. One part is document on policy for refunds/deliveries
9. Looking up specific driver on map to send back to c1
10. mind blown

# now

* drive sync pane / drive sync
* peek view
* settings pane: crawler section
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
