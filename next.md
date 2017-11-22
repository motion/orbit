# done

- return focus to previous window on hide ora
- bug: hitting close causes state of openness to bug out
- explored pouch-leveldb, seems possible but bailed because it was frustrating
- build if-changed working
- we have black now in electron with @view.electron
- dev extensions: mobx + react in electron
- fixed some performance regressions in app
- fixed show/hide to be smooth
- simplified some stuff so panes are easier to customize
- fixed ref to properly trigger changes
- { flex } elements in actionbar
- cancel crawl working in browser + ora
- stack traces nice in electron
- working open/close settings pane in electron
- sync state from electron to oraStore.electronState
- Crawler: can start/cancel/see progress in a drawer
- Crawler: can confirm results afterwards
- Assemble 5 good knowledgebases to test on from Zendesk/Intercom/other
  - custom - https://www.dropbox.com/help/security/recover-deleted-files-folders
  - intercom - https://docs.expensify.com/setup-for-submitters/day-1-with-expensify-submitters
  - shopify (zendesk?) - https://help.shopify.com/manual/apps
  - groupon (old zendesk? pure js) - https://www.groupon.com/faq
  - uber (zendesk?) - https://help.uber.com/h/6949160d-3eb6-42cd-8155-1ae3cf25be0b
  - zenefits - https://help.zenefits.com/Medical_Dental_Vision/Learn_About_Health_Insurance/Qualifying_Life_Events/01-Common_Qualifying_Life_Events/
- crawler clear results between crawls
- OAuth into Slack
- car: reduce pane render calls, lots are happening
- bug: if chrome is empty tab, dont show context
- bug: ora pane flickering away when you try and edit crawl settings
  - bug with running crawls on diff sites within same session

# now

- bug: on window focus (clicked via dock or via task switch) make ora show if hidden
- indexeddb for item contents, add hook to remove in model, add getter to fetch contents
- settings pane to choose a room
- Slack scan room for and collect links
- Slack import using Readability
- Crawler: if on a knowledgebase root of known type, have it auto-crawl
- Crawler:
  - Needs to store crawl settings once completed so it can re-run
  - Needs to store proper url for each item so it can detect pinned
  - Needs improvement to ux while crawling
  - Needs place to see/edit stored crawl settings
- better way to prevent click events
  - problems:
    - bug: click happens even when dragging
    - bug: cant scroll or hover things or click anything on first click
      - usually you want to prevent clicks on focus, but may want to allow for ex click on titlebar
      - also, hover/scroll while inactive are really important, especially scroll
  - solution:
    - hacky first version could just shim reactElement, shim onClick for any onclick, and prevent
      - we can just set window.shouldPreventClick for now
- onboarding:
  - simple next/back onboarding pane
  - steps:
    - 1. Welcome to Orbit, we need to setup integrations
    - 2. We work with your browser, navigate to your knowledgebase in Chrome
      - Open ora window that welcomes them, instructs them to go to knowledgebase
      - Ora needs to detect when they enter a Intercom/Zendesk/etc knowedgebase
      - Have "Add this site" button glow for them
      - Should show some nice stats on estimated time, etc
      - Once they start first crawl it shows status, re-focuses the onboarding window:
    - 3. You can also Pin individual sites
    - 4. Keyboard shortcuts / search / usage generally
    - 5. Done! Tweet/email us easily here
- get a bundle of app built
- test bundle onboarding process
- super basic onboarding window

## focus
- intercom
- slack
- microsoft word/excel
- intercom/zendesk apps (likely not hard)

## ingest
- sources:
  - local files
  - dropbox
  - google drive docx type (titles at least)
  - drive excel files (titles at least + link to them)
  - jira/confluence
  - slack
  - gmail
  - calendar
- people:
  - sync people in from various oauth sources
  - doing smart combination of people across sources
  - modeling of topics people are experts in
  - returning proper people for certain things / showing in app

## small things
- resizing the window (height)
- peek things
- show body contents snippet when on thing
- need to do bolding inside ui.text so it works well with clamps
- :bug: once you pin the results disappear
- :bug: prevent click going to url unless window is focused
- :bug: popovers stick when you scroll
- :bug: popovers stick when you close window
- use scraper for preview so title matches eventual pinned result
- get favicon from website
- way to go "back", because its confusing if you accidently leave
  - magnifying glass turns into back button
  - keep a stack history in stackStore
  - stack should load item with prop onLoaded and wait for that before navigating
- favicons and urls showing in subtitle in context results
