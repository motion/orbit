# done

- return focus to previous window on hide ora

# now

- crawler
  - { flex } elements in actionbar
  - show crawl status:
    - change Start Crawl to Disable
    - show crawl status in action bar (1/6 pages...)
    - show Cancel Crawl button
    - ideally, show this all in a slide up banner so you can keep moving
- get a bundle of app built
- test bundle onboarding process
- super basic onboarding window

## product
- settings pane working
- onboarding flow
- related project/task/person in special area

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
- make stack link to url so that hmr doesnt lose state
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
