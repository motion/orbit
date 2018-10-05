---
title: Update One
date: '2018-09-29T22:12:03.284Z'
---

_Note: this is for early insiders, please don't share the link. I'll go into some more detailed product and distribution plans._

I'm really excited to start talking about Orbit. It's been in intense development for a while now, so it feels great to put it into the world.

First, the good stuff. We're sending out the first builds to [mailing list subscribers](https://tryorbit.com). Please join and I'll send it to you as well.

---

I'd like to introduce Orbit. Let's start with a story:

You read, write, email, chat, document, and ticket... from Slack to Jira, GDocs to Github. Your knowledge is distributed across many services, and internal wiki's and portals don't keep up -- they're another source of truth, a cumbersome point of interaction, and more infrastructure to maintain.

There's a trend that's happening in our world, and it's preventing us from staying on top of whats going on in our companies and in our digital lives. Before going into detail, I think it's actually best explained by the gap between the sci-fi interfaces we dream of in film and TV, contrasted with the reality of how we work today.

> We wanted [sci-fi interfaces](https://www.youtube.com/watch?v=PJqbivkm0Ms), instead we got 100 browser tabs.

![iron man](http://gradschoolguru.com/wp-content/uploads/2017/01/Iron-Man-Movie-Prologue-Hologram.jpg)

<div class="alt">
  Ergonomically though, we can do better.
</div>

The visual effects of Iron Man and Minority Report may not be necessary, but these movies do grasp at a real and unmet desire today: unification, fluidity, and better control over our information.

The world today is becoming a world of silos inside web services. Browsers are silo-explorers, and tabs are how they maintain it. We think if you want to fix applications and the data we explore, you have to break out of the tab. Where we once had _files_ in operating systems that gave us portability, today we have no equivalent. Futher, even when we can export data from a service, we have no good interface to put it to use.

This brings us to Orbit's mission:

> To create a new [aggregator](https://stratechery.com/2017/defining-aggregators/) of information that gives control of our data back to us -- with a flexible, powerful, intuitive platform.

I think of Orbit as the answer to a general desire we ran into time and time again in user research, in many different forms, that can be summarized as:

<p><center><b>"I want to understand/organize my knowledgebase, and can't."</b></center></p>

## Orbit

For the last two years we've been building something to help solve this. It fixes what browsers and cloud services fail at today: we can't unify and manage our information.

To fix this, Orbit is a play to help re-decentralize the web. It does this as a platform, as opposed to a service. Instead of storing data or adding a new source of truth, Orbit just explores your existing information (much like a browser or operating system).

Operating systems gave us a lot of control with _files_. [In some forms](https://www.salon.com/2017/09/03/remember-palms-webos-maybe-not-but-apple-and-google-definitely-do/) they even gave us beautiful unified interfaces of contacts, calendars and messages. Meanwhile browsers give us the ability to explore widely (with less control). Orbit wants to give us back some flexiblity: to manage, understand, and organize our information. We want to enable you to:

- Navigate disparate knowledge quickly and easily.
- Search intuitively by person, topic, and time.
- Augment your day with information you may normally miss, as you work.
- Build, extend and install helpful information apps with ease.
- Do all of this without giving up privacy or security.

<div class="demo-image"></div>

<div class="alt">
  A Topic Explorer for Github app, opened in Orbit
</div>

### Distribution: From Roadblock to Selling Point

To replace stale and clunky intranets of today, Orbit will crawl a lot of your sensitive information. But that creates a tension for a typical startup: _no one wants any one company to handle literally all of their data_. It's a misaligned incentive that we ran into it early in our user research. Even close friends wouldn't install trial versions of Orbit to use at relatively fast-and-loose startups, without clearance from higher up.

We wanted to focus on building a better knowledge tool, but it became clear having Orbit in the cloud or on-prem would force us to build a good sales team, and take resources away from the already very hard task of a building a difficult product.

The solution we found came out of frustration with this tension, and out of a realization: today's computers are powerful, and today's NLP is orders of magnitude faster and easier than just a couple of years ago. Could do it all on-device?

<div class="graphic">
  <div style="margin: auto;  max-width: 100vw;">
    <img alt="On-Device = Data stays on your computer" src="./illustration.svg" />
  </img>
</div>

Today, Orbit realizes this strategy. It runs, syncs, searches -- does everything -- completely private to your computer. We still need to finish some of the team-level syncing features, but we have a guarantee: we'll never handle your data outside of your computer. Today, you can even firewall Orbit just to be safe.

### The Features

For now Orbit is a lot like Spotlight with a Home. The Home shows recent activity, a directory of people, and the apps you've installed.

> Use the shortcut Option+Space to open Orbit from anywhere.

Orbit will grow to become more akin to a knowledge assistant. It will get better at understanding natural english, sorting for staleness, augmenting you as you work, and summarizing large amounts of noisy data into more useful views. It will also become a lot more contextually aware, which I'll explain in the Context section.

<div style="width: 480px; border-radius: 20px; overflow: hidden; position: absolute; right: -560px;">
  <img alt="Orbit Home" src="./home.jpg" />
</div>

#### Bit

We're calling a file in orbit a _Bit_. Where your OS has files and apps, and SaaS products have a plethora of unique interfaces and APIs, Orbit has bits and apps which give us a consistent interface. A bit can represent Text, HTML, Tasks, Conversations, Documents, and more.

#### Language

Orbit comes with a [state of the art](https://arxiv.org/pdf/1803.08493.pdf) natural language engine. Importantly, it runs quickly on-device and is custom to your knowledge: it's relevancy is powered by the meaning of words in English and their frequency in your corpus.

![Cosal word importance](/cosal.jpg)

<div class="alt">
  Cosal showing relative word interestingness in realtime.
</div>

#### Context

Context will be the first big step Orbit makes to deliver on the "future of computing" promise. Powered by a novel OCR engine that focuses on one thing: being fast. We're close to having it to use <1% of your laptop battery.

Why an OCR engine? It means no matter if you're writing an email in Mail.app, talking on Slack, browsing the Web, or doing anything on your computer, Orbit understands what you are looking at, down to the lines you write.

Combined with the Language engine, it means Orbit can do _meaningful search_ to find extremely relevant items within your knowledgebase based on whatever you're doing. But that's just the start. Context is not yet available in Orbit, but it's close.

#### People

People are a first class concept in Orbit. Using the aggregated information from the apps you plug in and the Language topic modeling, we show topics people are experts in, alongside recent activity.

#### Apps

With all of these pieces together we have apps. Some apps we've built out of the box: Gmail, Google Docs, Github, Slack, Jira, and Confluence. We'll be adding more flexible ones next like Web and API crawlers.

<div style="display: flex; flex-flow: row; height: 120px; max-width: 100%; justify-content: space-between; padding: 30px 0;">
  <img class="icon" src="./icons/gdrive.svg" />
  <img class="icon" src="./icons/github.svg" />
  <img class="icon" src="./icons/gmail.svg" />
  <img class="icon" src="./icons/jira.svg" />
  <img class="icon" src="./icons/confluence.svg" />
  <img class="icon" src="./icons/slack.svg" />
</div>

#### App Store

We can't predict what apps and views will be most useful for any one person or company, though. As we finish each of the above mentioned parts, along with our interface kit, we're going to release an App Store later this year.

Apps will have full access to the People, Language and Context APIs, our UI Kit, and importantly, a built in live-editing environment that lets you go from code to deploy in one-click -- with no infrastructure required.

If you're interested in building apps on top of Orbit, get in touch with me below. I'll set up a Slack room where we can play with early builds and build cool apps together.

### Join our Orbit

There's a lot more I'd like to write, but this enough to start. Keep in mind these are early builds, we're putting a lot in motion but it's not quite to a revolution, yet. That said we have some interesting parts ready to fall in place. I'd love your feedback as much as possible keep our momentum on the right path.

I'll keep our [roadmap](/roadmap) updated and send [mailing list](https://tryorbit.com) updates ~monthly.

<p>
  <a href="mailto:nate@tryorbit.com">Here is my email</a>, send any and all inquiries, requests, issues.
</p>

[Join our Slack room](http://slack.tryorbit.com) if you'd like to discuss or give detailed feedback.

<br />
