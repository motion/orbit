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

# now

* UX:
  * crawler: in progress pane
  * second window that tracks next to main window
  * second window shows peek view of items
  * feature: on window focus make ora show if hidden (clicked dock / task
    switch)
  * better way to prevent click events
    * problems:
      * bug: click happens even when dragging
      * bug: cant scroll or hover things or click anything on first click
        * usually you want to prevent clicks on focus, but may want to allow for
          ex click on titlebar
        * also, hover/scroll while inactive are really important, especially
          scroll
    * solution:
      * hacky first version could just shim reactElement, shim onClick for any
        onclick, and prevent
        * we can just set window.shouldPreventClick for now
  * resizing the window (height)
  * show body contents snippet when on thing
  * bolding inside ui.text so it works well with clamps
* Home:
  * Show current context as first item so you can look back into it if wanted
  * Show recently viewed
  * Show recently pinned
* Crawler:
  * feature: crawler/crawler options.disableStructureFinding, just readability
  * Setting panes to see stores crawls + run + see/manage results
  * Store crawl settings once completed so it can re-run
  * Store proper url for each item so it can detect pinned
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
  * get a bundle of app built
  * test bundle onboarding process
  * super basic onboarding window
