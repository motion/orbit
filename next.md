# next
  - fix motion 3s load delay
  - fix hmr from models/app breaking everything
  - fix popover on user dropdown
  - dropdowns for bar, only show button per category
  - sidebar org mode
  - document todos two way sync

# needed

- db per place
- hashtags

# grabbag

  - presence
  - comments
  - quicker doc creation
  - linking between docs
  - grid
  - vote list
  - @mention
  - cursor indicator
  - fancy ml summarizer
  - integrations

# technical

- <Form /> which passes context to button
-    <Button /> which takes form context to add &:active style
- light theme by default
  - input, button, drawer, listitem, popover, text, title, ...
- move app logic to root stores
  - proper (user|auth|key|errors...) stores
- actions can be observed on any store
- make App a proper store
- give models their own manager that takes all options for couch
- move App into web
- split user/auth/errors stores into stores
- // somehow make app connect stores through actions
