---
title: Update One
date: '2018-09-29T22:12:03.284Z'
---

_Note: this is for early insiders, please don't share the link. I'll go into some more detailed product and distribution plans._

I'm really excited to start talking about Orbit. It's been an intense few years of development to get here so it feels great to be able to share it with you all.

First, the good stuff. An early build is now [available for download](https://orbitauth.com/download). We've pushed hard to get it to usable for feedback, but be warned it's alpha quality.

---

So... what is Orbit? Let's start with a story:

You read, write, email, chat, document, ticket... you're productive. From Slack to Jira, Google Docs to Github. Your knowledge is distributed -- but a wiki or intranet portal doesn't really help sort it. They add extra sources of truth, and infrastructure. They are clunky to use and chronically stale.

There's something wrong here. I think it's best explained by the gap between the sci-fi interfaces we've seen for decades in TV and film and the reality of how we work today.

> We asked for [sci-fi interfaces](https://www.youtube.com/watch?v=PJqbivkm0Ms), we got 100 browser tabs.

![iron man](http://gradschoolguru.com/wp-content/uploads/2017/01/Iron-Man-Movie-Prologue-Hologram.jpg)

<div class="alt">
  Ergonomically, though, how long can you keep your arms like that?
</div>

While the overdone effects of movies like Iron Man and Minority Report are a distraction, what these movies do grasp is a real unmet desire: unification, fluidity, and control. The web and the browsers we surf it with today just don't give us that.

This brings us to Orbit's mission:

> To create a new [aggregation platform](https://stratechery.com/2017/defining-aggregators/) that gives control over data back to the individual -- with a flexible, powerful and intuitive knowledge tool.

It's an answer to a general desire we ran into time and time again during user research:

**"I want to understand my knowledgebase, and I can't."**

For the last two years we've been building something to help solve this. It fixes what browsers and cloud services fail at today: we don't have any control of our information.

To do that, Orbit was built as a platform, not a service. We don't store data. Instead, much like a browser or operating system, Orbit just helps explore existing information. Where operating systems gave us a lot of control (with _files_) and browsers gave us great collaboration (with less control), Orbit splits the difference.

It does this by running on your device, syncing centralized cloud services into a decentralized knowledge explorer. We want Orbit to allow you to:

- Navigate disparate knowledge quickly and easily.
- Search intuitively by person, topic, and time.
- Augment your day with relevant information as you work.
- Build and install internal tools on top of it with ease.
- Do all of this without giving up privacy or security.

<div class="demo-image"></div>

<div class="alt">
  An example Topic Explorer for Github app opened from the Orbit Home
</div>

### Distribution: From Roadblock to Selling Point

To replace the stale and clunky intranet systems of today, Orbit will need to crawl a ton of your sensitive information. But, in doing so there lies a tension in misaligned incentives, one we discovered early in our user research:

_No one wants to trust any single company with all of their data._

Even our close friends didn't want to install early trial versions of Orbit to use at their relatively fast-and-loose startups. We wanted to build a better knowledge tool, but it became clear that having it live in the cloud or on-prem would mean security questions, difficult onboarding, and therefore a sales-forward team.

But we realized, today, computers are powerful, with lots of memory. Modern NLP is orders of magnitude faster and easier to do than just a couple years ago. In frustration with our failed sales, we had an idea: run Orbit entirely locally on your computer. If we could, we'd avoid our distribution problem.

<div class="graphic">
  <div style="margin: auto;  max-width: 100vw;">
    <img alt="On-Device = Data stays on your computer" src="./illustration.svg" />
  </img>
</div>

Today, Orbit realizes this strategy (without some of the decentralized pieces we are still working on). It never sends a bit of your data outside your computer (you can even firewall it to be sure). We'll write more on this in the coming months.

### The Product

The Orbit Home is your flexible unified knowledge launcher. For now it's a lot like Spotlight with some recent activity and a directory of people.

<div style="width: 480px; border-radius: 20px; overflow: hidden; position: absolute; right: -560px;">
  <img alt="Orbit Home" src="./home.jpg" />
</div>

> Use Option+Space to open Orbit anywhere

#### Bit

We're calling a file in orbit a "Bit". Where your OS has files and apps, and SaaS products have a plethora of unique interfaces and APIs, Orbit has bits and apps. A bit can represent Text, HTML, Tasks, Conversations, Documents, and more.

#### Language

Orbit comes with a [state of the art](https://arxiv.org/pdf/1803.08493.pdf) natural language engine. Importantly, it runs quickly on-device and is custom to your knowledge: it's relevancy is powered by interesting words in English as well as their relative frequency in your corpus. This powers search, related items, and interesting word extraction.

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

### Going forward

There's a lot more I'd like to write, but I think this is more than enough to start. Right now Orbit is buggy and incomplete, but the underlying technology is all there. It took a ton of hard problem solving to get it to where it is, and it's really well set up to move quickly now. I look forward to all of your bug reports :).

[Here is my email](mailto:nate@tryorbit.com) send me any and all inquiries, requests, issues.

[Sign up to the mailing list](https://tryorbit.com) for blog update emails ~monthly.

[Join our Slack room]() and [the download link again](https://orbitauth.com/download), for those who missed it.

Let's start a revolution!

<br />
