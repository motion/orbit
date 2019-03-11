Andrey,

We just use this at the moment to plan next steps, plus Github PRs.

The tickets in Github are a bit to heavy for us atm.

We should both edit it as we go.

Welcome 🙌

---

## Onboarding

1. Get app running
   - Go over important areas and review tech
2. Go over current plan
   - Discuss broad strategy + upcoming months
3. Edit this together and create our detailed plan for next months

## Feedback

I'd like you to have time to get familiar with the app and explicitly give feedback. I know you have years of interesting experience and probably have many patterns, tools, refactors, etc you recommend. Please do send them my way in the initial weeks and ongoing.

---

## Initial idea for how we plan

The ideal way I see things going is:

- We all establish the desired goals
- Plan together best way to split that up and rough estimates
- Then, we individually fill in details for the high level bullet points we planned together

---

## My plan, currently

The best way I can see us going over the next six months involves achieving multiple things.

1. A great demo that is roughly running on real code.
2. Polish / productionize the demo while building a website/docs.
3. Sell that demo while building out "supporting" features (more integrated apps, onboarding, account, etc)

### Step 1

I think my best duty here is to come up with the examples ahead of time so we can split out the work to best get there. Then, you and Umed essentially split up the steps to make it real and we track that as we go.

There would be a decent amount of me helping out on UI and app-side stuff I imagine, while you focus on the "running on real code" part, ie: making custom apps a thing + making syncing and space-level features actually work. But I don't mind as long as we are tracking directly towards a good demo.

### Step 2

Here I'd imagine we get more isolated. In general, I'd be on design and you'd be on architecture, but we'd all be focusing on having a few apps we can show and getting the various features behind them polished: dev environment, syncing layers, APIs, and so on.

### Step 3

This is longer term, but basically if we make it here we are in good shape. Ideally, I'm fully on website. I also set up the framework for docs, and you and umed are help fill them in with me.

Umed likely stays on fleshing out integrations and their APIs. While you move into onboarding, account, app store infrastructure, etc.

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
   1. Should be able to init a new app, have our @o/build run it and compile it
   2. Should be able to start/stop/create/publish apps generally
3. In orbit-app:
   1. Should be able to create custom app, then hit "edit" and have it run with CLI
   2. Should then swap the running app into development mode and show the dev-server output
   3. Should be able to edit the app with hot reloading
   4. Should have a nice error catching mode for that
   5. Should finish by hitting "Preview" at which point it will compile into prod mode
   6. Should in "Preview" mode let you use the app with prod compile, then hit "Publish"
   7. Publish should then work with the p2p publishing service to push app and update everyone
