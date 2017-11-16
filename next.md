# done

- return focus to previous window on hide ora

# now

- bug: hitting close causes state of openness to bug out
- bug: ora pane flickering away when you try and edit crawl settings
- crawler
  - after crawl needs to show the results before committing them
    - should let you uncheck some results
    - should let you enter a url/title exclusion scheme too
  - bug with running crawls on diff sites within same session
  - cancel crawl working in browser + ora
  - { flex } elements in actionbar
  - show crawl status:
    - change Start Crawl to Disable
    - show crawl status in action bar (1/6 pages...)
    - show Cancel Crawl button
    - ideally, show this all in a slide up banner so you can keep moving
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
- settings pane: general settings + integrations split out + working open/close
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
