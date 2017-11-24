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
* indexeddb class
* idb for Thing.body
* merge crawler
* endpoint for single page pin

# now

* pin single page button working
* slack syncer working using endpoint
* slack syncer date working, index last 3 months
* crawler ui cleanup
* second window that tracks next to main window
* second window shows peek view of items

* bug: on window focus (clicked via dock or via task switch) make ora show if
  hidden
* Slack import using Readability
* Crawler:
  * Setting panes to see stores crawls + run + see/manage results
  * Store crawl settings once completed so it can re-run
  * Store proper url for each item so it can detect pinned
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
* onboarding:
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
* get a bundle of app built
* test bundle onboarding process
* super basic onboarding window

## focus

* intercom
* slack
* microsoft word/excel
* intercom/zendesk apps (likely not hard)

## ingest

* sources:
  * local files
  * dropbox
  * google drive docx type (titles at least)
  * drive excel files (titles at least + link to them)
  * jira/confluence
  * slack
  * gmail
  * calendar
* people:
  * sync people in from various oauth sources
  * doing smart combination of people across sources
  * modeling of topics people are experts in
  * returning proper people for certain things / showing in app

## small things

* resizing the window (height)
* peek things
* show body contents snippet when on thing
* need to do bolding inside ui.text so it works well with clamps
* :bug: once you pin the results disappear
* :bug: prevent click going to url unless window is focused
* :bug: popovers stick when you scroll
* :bug: popovers stick when you close window
* use scraper for preview so title matches eventual pinned result
* get favicon from website
* way to go "back", because its confusing if you accidently leave
  * magnifying glass turns into back button
  * keep a stack history in stackStore
  * stack should load item with prop onLoaded and wait for that before
    navigating
* favicons and urls showing in subtitle in context results
