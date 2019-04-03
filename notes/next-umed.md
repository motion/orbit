NEXT

- Postgres fake data:

1. Signup for retool, add this template https://tryretool.com/templates/customer-support-tool
2. See how it has a good example ecommerce data structure? We need to insert something like this into postgres... I'm not sure where they got their data, but if you look at the data explorer its got a lot of tables/columns, so we likely need to find a place where this exists already.

I did some initial googling, all I found is:

https://github.com/drehimself/laravel-ecommerce-example

It has fixtures that inserts example data....

I've been searching google with

"site:github.com ecommerce example seed sql"
"site:github.com ecommerce dummy sql"

This one only has a couple

https://github.com/SqlHareketi/dummy-product-data/blob/master/data.sql

but looks too small

this one looks big:

https://github.com/devrimgunduz/pagila

That may be the best one 👆

Now, we need to make this "auto-set up in the app". I think we really need to get workspaces working, which I'll switch onto shortly, but until then, can you make a script and make sure it inserts?

Also the files here too big so have the script download into a tmp dir and insert. You can put it all in ./scripts. Ideally with one command you run and it sets up everything, from creating docker db to inserting info, to adding the app information to the sqlite db in our app automatically, so i can tomorrow take that and build out a whole postgres demo!


---

- Can you please fix the type errors caused by slack in typescript?

---

Big projects for this week:

We need a way to generate documentation based on our components.

1. Check out the new `projects/docs`, get it to run (should run, may need some bugfixes).

It's based on react-bootstrap docs website you can find their source on github.

Perhaps its better to use the gatbsy official docs, but not sure. They don't look as nice, but perhaps are better "set up" or have inspiration.

https://github.com/gatsbyjs/gatsby/tree/master/www

The goal is:

   1. Lets try and get the `@o/ui` to automatically import somehow. Just the types definitions for components.
   2. Script to import `@o/ui` types + comments into mdx files inside a folder in docs
   3. See how react-bootstrap does component previews with props you can configure and get our `@o/ui` to import into docs site and then render components inline + automatically show the component inline for each component in ui kit.

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
