## product
- settings pane working
- onboarding flow
- various fixes for good ux
- calndar meetings
- related project/task/person in special area

## focus
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
- settings pane: general settings + integrations split out + working open/close
- auto minimize height if window behind is at bottom (slack)
- return focus to previous window on hide ora
- hover to see tooltip peek (test if it be done in same browserwindow)
- add preview of body contents when showing items
- hiding should remove pointer events
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
- prevent flickering when moving between pages
  - stack should load item with prop onLoaded and wait for that before navigating
- favicons and urls showing in subtitle in context results
