Umed Week of July 15

Review last week:

- Ok progress made on code, will get better as we align better
- We need to align better on what next weeks need to be
- That requires me having more clear plan for you
- Ask for more flexibility in terms of doing "draft" impl => improve later
- Want to avoid changing data structures too much, dumping into .data is fine

---

Plan (High Level):

- Demo: We're still aiming to have a great demo by Sep 1
- Alpha: Also aiming to have a first alpha release cut by Aug 15
  - Alpha doesn't need to be particularly stable, just able to cut in prod mode

After Sep 1 we will shift into beta mode:
  - Performance upgrades
  - Stability upgrades
  - Refactoring some areas
  - Final feature implementation

---

Demo (High Level):

- Needs
  - All our current syncers with lots of data
  - Search is fast, fluid, accurate
  - Peek windows show good summary + recent updates
  - Search results highlight important part of the doc based on search
  - Onboarding works well
  - Works well with more than one person (basic sync of settings)
- Wants
  - Also has some more flexible integrations (Crawler/API)
  - Profile cards aggregate across services
  - Shows some IDE-level features
  - Shows some basic OCR search features

Alpha (High Level):

- Needs
  - import needs from '../Demo (High Level)'
  - Build to prod script thats fully automated
  - Debuggging onboarding experience more thoroughly
  - Auto-updates
- Wants
  - Needs more thought into Accessibility setup steps
  - Needs more thought into Mac Tray interface
  - More settings polish/flexibility

---

Step by Step:

Nate:

1. Finish out frontend design, interaction, perf, features (3 weeks)
  - Search - better highlights, accuracy, interaction
  - Peeks - consistent and better for docs, tasks, mail, etc
  - Settings - have real interface for all of them, handle removes
  - Filters - filter by integration, type, time range, person
  - Basic sentence breakdown working
2. Final features for demo
  - Show recent events (mockup at least)
  - Profiles aggregation work
3. Onboarding process
  - Onboarding screen
  - Scanning chrome/ff history
4. Productionize
  - Lots of bugfixing and small feature improvements
  - Build script, auto update
  - Changing screen sizes
  - Keyboard shortcut support, etc

Umed:

1. Syncers (1 week full-time, then part time ongoing)
  - Full sync capability for each
  - People syncers for each
  - Attachment/image syncers for Slack
2. Model/query system (1 week full-time, hopefully less for simple graphql)
3. Search speed/accuracy (1 week full-time, part time ongoing)
  - Proper indexes
  - Good setup for filters
  - SQLite hst5
4. Migrations system productionize help (part time ongoing)
5. Return to syncers / upgrade app all over

---


Breakdown for Umed:

## Syncers

Here's what's important about syncers:

- That we don't spend too much time on them because the demo and beta both have much bigger requirements on:

- Onboarding
- Experience
- Stability
- Features (filtering, homepage)

So any time spent debating the perfect setup for these is a big waste. Getting them to be stable is the only important part. Then we can focus on indexing working better, add in the nicer sqlite search plugin, add basic filtering, focus on UX, and generally focus elsewhere.

It's important to note that we literally can't predict the requirements yet! It may be that Slack search it's really important to search links and images. Or that we need to redo how we group conversations. Or that Gdocs we need to redo to do some sort of local folder sync and then add in some .doc scanners.

That's totally fine, we're just trying to get everything in place right now so we can iterate on a working app. Right now the app doens't work well yet. But it's not because model structure is wrong. It's because it just needs a lot of focus in a lot of areas outside models.

Our best strategy is to get syncers working as they are, and to be both *flexible* and *simple*. That's how they are designed for now. We will throw in all the data we can find into that model, test and iterate UIs based on that. And be ready to change it as requirements come in.

That's why I'll say "just throw it onto data". It's more than fine for now. Any extra relations or big huge structural changes are going to eat into *very precious* time getting the rest of the app to work well and stay flexible.

Ideally we spend only another week on syncers in total and that lasts us until September. They all work basically well enough, they just need a little more reliability and depth is all.

The idea is: upgrade in place. We need to upgrade things in place. After we are beta testing we can figure out better requirements and solidify things. Until then we need to be quick and light in changes.

So before I handed them over these are the big fixes they need. And we need to basically execute on getting all of this executed this week:

- Sync *everything* of just the types we have, not just partial
- Sync People for all of them
- Store last sync info to prevent huge CPU intense re-syncs
- Handle deletes/updates reliably

Any sort of refactor is off the table until we gather requirements more.

This is important that it's an iterative process. All the API's act differently and have different limitations.

I am really worried we are going to clash very hard on this. I can't really afford to spend a lot of time debating this.

Handling changing requirements *is* our goal right now. So I just need a lot of help in keeping things working while upgrading the pieces.

Big rewrites are just really off the table until we know requirements better.

What we will need is People.

## Model/query system

Ok, I don't care about sharing models on the frontend if it's going to be a pain in the ass. I'd prefer it, but if we could have this query work then it's fine. It seems we could easily boot up a graphql wrapper around SQLite. We could even get the data stuff like this:

```graphql
{
  bitSearch(search: "something", limit: 10, offset: 0) {
    title
    body
    type
    integration
    data {
      slack {
        messages
      }
    }
    people(limit: 5) {
      name
      avatar
    }
    events(limit: 5) {
      type
      title
      description
    }
  }
}
```

```graphql
{
  personSearch(name: "nate") {
    name
    avatar
    integrations {
      name
      link
    }
    recentBits(limit: 5) {
      ...Bit
    }
  }
}
```

What is important is making this swap work "in-place". As you can see from my recent commits, it's very possible to upgrade big pieces of the stack without rewrites. The mono-repo helps. Just needs to be one step at a time, so we have a working master at all times, and are merging into it consistently.

To me that is the important metric:

We are merging big improvements towards these goals that don't break things at a consistent pace.

I  want the next weeks to really feel like progress in the app itself, not behind the scenes. The only big behind the scenes change I see is the graphql api instead of models, but tbh that even can be done as simple as possible and will mostly swap out existing model queries without big changes structurally.

Once we hit september we can turn around and move into a different mode based on feedback we get from deploying it.

## Return to syncers / various stability

We likely really want Events for making the peek cards and search results a lot more helpful. I'd keep this in mind as you go. Slack conversations for example wouldn't really have updates, but Documents and Tasks woud.

- We only need to store the most recent events
- We don't really need any fancy relations for them because we are never querying by "recent events" just searching for the Bit and then showing it's events, so this really could go onto a field `.events` directly

## General notes

I actually don't mind if you don't move super fast as long as you are upgrading things in-place. For example adding the graphql api could happen very easily without need for us syncing too heavily. Upgrading and fixing types in lots of places is totally fine to spend time on as you go. If you run into problems with database issues, etc, thats good.

## Productionize

This will be your final stuff leading into September. For example, making sure we can build SQLite with hst5 search plugin into prod. Making sure auto-updates work well. Bugfixing a lot of stuff we'll generally be on that together.
