NEXT

---

Big projects for this week:

We need a way to generate documentation based on our components.

1. Check out the new `projects/docs`, get it to run (should run, may need some bugfixes). It's based on react-bootstrap docs website you can find their source on github.
2. Lets try and get the `@o/ui` to automatically import somehow.
   1. Script to import `@o/ui` types + comments into mdx files inside a folder in docs
   2. See how react-bootstrap does component previews with props you can configure and get our `@o/ui` to import into docs site and then render components inline + automatically show the component inline for each component in ui kit.

---

Smaller fixes if you get stuck on docs:

- (not sure if already there) add some "write" operations to the various data apis
  - Slack.sendToThread, etc
  - Gmail.sendMessage, Gmail.archiveThread


- debug why "Remove" broke
  - right click on any app Tab and hit Remove and it should delete it


- debug why sorting apps/app tabs broke
  - on home and in the tabs, you should be able to drag to sort, there are some bugs
    - sometimes it doesnt work for me, this is the main bug


- mediator make resolvers simpler:
  - instead of requiring registering all the commands centrally with mediator, make it so you just call resolveCommand() anywhere and it will register it. this will make Mediator work a bit differently, but it will work with context much more easily
    - also make it error if you register same command twice

- add a couple more data apps
  - Databases
    - Firebase
    - MySQL
    - Redshift
  - S3
  - Stripe
  - Twilio

- Make App Settings works
  - See how in the little "Manage apps" pane on the right-most tab you can see apps settings, we need to make this actually work with apps
  - We should make this NOT doable with components
  - Ideally really would be JUST typescript types honestly
  - And then we can generate interface from there!
  - There's a compiler somewhere on github to turn types into JSON, we can use that
  - You can then store this on AppBit

- Data Explorer
  - Dont do this one yet if you can do above stuff first
    - (we may do graphql for this, not sure yet)
  - This tab you can start making work
  - It should list data apps already + show fields for them
  -
