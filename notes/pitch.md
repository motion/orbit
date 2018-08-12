# Orbit

First, the demo really speaks for this product more than anything. The experience of having a fluid, smart, fast assistant that allows not just for search across everything in your cloud but exploration of people and powerful NLP topic following / fast filtering and slicing of what's going on is a really big factor. We plan on having a really big splashy launch. The diff between a simple "textbox" and our interface is incomprehensible without seeing it.

---

"The Secret"

You have to understand the trend of ERP and the Cloud to see how we arrived where we are.

Modern companies SaaS stacks:

- ERP software dominates until early to mid 2000s
- The Cloud comes and fragmentation expands through to today (Chat, Documents, Salesforce, etc)
- Now every app has it's own data silo and every service a unique and poorly done interface

So the choice now is:

1.  Build an ERP and convert everyone over to it (See: Microsoft, Google, etc, not working people still use "whats best")
2.  Sync everything from every service you can and unify it

#1 is not doable as a startup, and #2 is where tons of startups are cropping up today because they rightly recognize that Coveo et al are lumbering beasts that do not integrate well with modern services and have obscure opaque websites with large sales processes, so they see room for a "Slack" of internal search.

It's a good intuition!

We were looking at fixing Wikis and stale Intranet systems, originally. We had a gut feeling and through talking with people realized companies have no "Home", and the knowledge they organize is constantly going stale and requiring lots of effort to maintain. Confluence and other wiki systems are really bad. We started exploring how to "build a better wiki" (as so many do).

We quickly realized: knowledge is now stored all over. In email chains, chat conversations, documents, tasks/issues, and in our wikis and brains. The only solution is to #2, but to make it "smarter" and have it figure out staleness and relevance well.

Again, this is a real problem in the world, but immediately you face:

1.  Unifying tons of things is a massive amount of Schlep.
2.  No one trusts you with all of their data.

For #1, the schlep is actually two or threefold. Not only do you need to write custom data syncers for every integration (lots of work), but you also have to then have your own resolvers that support unifying the _permissions systems_ of every single integration you have. You can't leak private documents the CEO is working on to random employees! And you have to do that for every single service.

Workday literally has a team of 35 people working on this right now, and I was told point blank by their VP that they are "struggling with it".

And that doesn't even get to #2, which is trust. Now, if you're Workday, sure, trust isn't as much of an issue. Though in terms of incentives, I don't know if that's fully true. If I'm a law firm or if my company has big trade secrets, do I really trust Workday with sensitive things? And am I really happy in the end giving _any_ company access to quite literally all of my data? The incentives work against each other! Search companies wants ALL the data, but interally, companies want to share AS LITTLE AS POSSIBLE.

So god forbid you're Startup X32953 and you want to convince even one big company to use your product. You have to do two impossible things at once: support massive amounts of complex syncing and permissions resolution, and then convince them to actually trust you! And trust not only that their data is safe, but that you won't disappear in a year and they'll have to go through a pretty painful onboarding with a whole new company! It's impossible. (And oh yea, did I mention onboarding is very painful if you want to go on-prem, as any medium+ size company would...)

So Coveo has a great moat.

We struggled with this for a while and explored other ideas. One day, we finally realized: What if we could avoid #2? Is there a way we can get around needing a centralized server? And a few failed experiments later, we figured something out that actually solved two things at once:

1.  No more trust issues
2.  No more onboarding pain
3.  No more complex permissions resolving!

We found we could "work around" the way Oauth systems function, and basically just have the syncers run independently on everyones desktop rather than in one of our centralized servers! It just required solving one less hard thing, and in exchange got rid of basically three impossible things!

Now instead of N hard work for every integration, we just had to build a much simpler p2p system to prevent from hitting Oauth rate limits.

And luckily, p2p is a solved problem, and the version we need is the simplest of all as it requires no fancy peerless setup (can coordinate through master), and also no real data storage. And especially no blockchain.

There are off-the-shelf libraries that are extremely easy to use and mature now (think: Stripe-level just 4 lines of code).

So the only "hard part" now was just one thing: writing a lot of syncers, which was doable (and is now mostly done for our first round of "Apps/Integrations": Github, Google Platform (Drive, Mail, Docs), Slack, Jira, and Confluence all work).

And now we're basically finishing the app and about to roll it out. We have commitments for free trials but with legit rollout within each from three "big" teams: Workday, Snapchat and Tesla.

---

"The Tech"

This part is not essential, but it does build up to explain how Orbit can be a really interesting platform play...

In the course of building Orbit we spent a bit too much time trying to do some fancy things. Part of this was because until we figured out the distribution secret, we were desperately trying to find something to do and so we explored heavily two areas: computer interfaces, NLP and OCR (mostly to power the interfaces).

## OCR

We built a ridiculously state of the art OCR system, and not just that, but it that actually _understands what you're doing as you do it on your computer_ including finding the area of the screen thats relevant. In 200ms start to finish we understand a full dense screen of text (Google's Tesseract is 8s for the same test, with no exaggeration).

What that means: We can go extremely far into some really cool augmented/smart OS features. And we actually built prototypes of this that work surprisingly well. Think:

1.  Highlighting any name on screen and showing what that person has been doing
2.  Powering your search results based on what you've paid attention to
3.  Automatic indexing of everything you read on your computer as a sort of "brain" you can search later

## NLP

Not very exciting. We found and helped refine a state of the art NLP algorithm that is importantly very fast so it can run entirely on-device. Basically, we can understand important words and search for pretty cool things (typing "golfer" will show "Tiger Woods").

What's cool about this, is we can provide both this and the OCR stuff as foundational pieces for...

## A decentralized App Store / Platform

Electron/React are taking over development. It's a dramatically better way to build apps. We pioneered HMR three years ago, but it's even better today.

But a few things are in their infancy, namely: The tooling is still immature, UI Kits are _way_ harder than anyone expected and basically don't exist, and most importantly deploying apps is actually really hard.

To deploy an app internally for your team, you'd need to:

1.  To boot up a server somewhere in your firewall
2.  To set up an entire environment in React with all sorts of pieces (UI, data management)
3.  To set up a complex build system to go from app to deploy

And every company does this internally and does it poorly. Actually more correclty is that no one really builds many apps, and when they do it's a huge cost and hard and painful to maintain.

Except Stripe and Stripe Home, they do it well. Which Stripe Home is worth searching and looking at, it's actually a big inspiration conceptually for what we're doing.

So in all the OCR / "Augmented smart computing" exploration we did before we latched onto the decentralized search tool we built out this insanely nice system for basically having multiple apps that interact with all your data and beautifully with your search.

And it's a really beautiful setup. We spent a lot of time getting the UI kit to be good enough over the last three years, it's state of the art.

But importantly, we figured out how to make all this stuff work together and make sense conceptually and feel really nice.

Funnily, the best way to think of it is as a sort of next generation Start Menu for Mac.

You have your search that lets you explore and see things, and then you can hover over anything and up pops a really nice mini-app that shows that content (think showing a Slack conversation or Github issue in a popout app from your start menu search).

Only, once we had these mini apps working nicely _and_ had a decentralized platform for syncing data between people it just becomes obvious: you've built a completely behind the firewall platform for building internal apps. Think: OpenFin, but sexier.

So that's where were at. The current day is basically a really nice internal search tool. The vision for the next 6 months to a year is an incredible app platform.

---

Random notes

The concept of a Person is universal in the app. You can see activity across all integrations aggregated into profiles of everyone at your company. It really helps it feel alive and was the biggest ask from many people we talked to. You can search peoples names, see their profile, see recent activity across everything and even what topics they care about etc. That really helps with the "Minority Report" feeling of it all. It also eventually gives it some HR / Org Chart potential.

Good way to frame it:

Coveo is a ~XX billion dollar company. They do "Enterprise Search" and then naturally branched into various internal tools.

We're disrupting them by building a "serverless" way to do internal search that avoids large onboarding costs and trust factors while delivering 100x better UX. It's an internal app platform that allows companies (and people) to build deploy secure and custom apps at least 3 orders of magnitude more easily, and with one click send them out across teams in what feels like a beautiful "Home" for companies.

Nearest neighbors:

Stripe Home, OpenFin ... Coveo/Swiftype

- big companies: coveo, swiftype
- guru (guru flux) - https://www.getguru.com/solutions/flux/
- cresta - https://www.cresta.ai/
- slab, carrot.io, tipihub.com, getnifty.io, tettra
- startups - diamond.io, layer
- openfin
- stripe home
- advanced tech companies' internal intranet, microsoft start menu meets ms365, google for work
- greplin / cue
- "inline related info" for any app on your OS
  - clippy (product)
  - rapportive (product)
- IDE tool companies:
  - https://retool.in/

---
