Organizing general plan for Andrey start, as best I can see.

Generally these are not set in stone and we can work through them. Just a good source of truth for our best list of next up.

Github is just a little too heavy for us at this point.

---

Goal #1: Getting Apps to build/share

1. A way to publish and receive published apps (npm powered, like vscode)
2. A service for publishing apps online with various commands / CRUD
3. Link that service into orbit-app AppsIndex search

Goal #2: Syncing configuration and other information p2p

1. App config and space config should sync through hyperswarm
2. Link that into Spaces and testing it out

Goal #3: Apps store for p2p

1. In the same way public one works, but instead uses hyperswarm
2. Allow for teams to collaborate without publicly sharing anything
3. May need some consideration for linking to github repo (instead, in addition to?)

Goal #4: App building CLI

1. Not sure if this should go above the first goal, or parallel with it
2. In orbit-cli:
   1. Should be able to init a new app, have our @mcro/build run it and compile it
   2. Should be able to start/stop/create/publish apps generally
3. In orbit-app:
   1. Should be able to create custom app, then hit "edit" and have it run with CLI
   2. Should then swap the running app into development mode and show the dev-server output
   3. Should be able to edit the app with hot reloading
   4. Should have a nice error catching mode for that
   5. Should finish by hitting "Preview" at which point it will compile into prod mode
   6. Should in "Preview" mode let you use the app with prod compile, then hit "Publish"
   7. Publish should then work with the p2p publishing service to push app and update everyone
