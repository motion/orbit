# completed
- strip whitespace if it exists in body text
- we need a line clamp feature that ellipses text after x lines
- add option to drill in rather than open in browser so you can see context
- clamp titles of context items (clamp=2)

# next
- dont show pin if already pinned (show that its pinned)
- dont show the exact same item in context for itself
- make stack link to url so that hmr doesnt lose state
- finish buckets
  - needs to take you back home when changing bucket
- settings pane: general settings + integrations split out + working open/close
- return focus to previous window on hide ora
- need to do bolding inside ui.text so it works well with clamps
- add preview of body contents when showing items
- hover to see tooltip peek (test if it be done in same browserwindow)
- :bug: once you pin the results disappear
- :bug: prevent click going to url unless window is focused
- :bug: popover flicker
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

# integration related
- fix settings pane
- sync github issues
- make github issues look nice in context
- import slack
- import email
- show related people
- show related project/task
- fix calendar
