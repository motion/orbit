---
title: Update One
date: '2018-09-29T22:12:03.284Z'
---

_Note_: this is a message for early insiders, please don't share the link. I'll be going into detail on future product and distribution plans.

I'm certainly excited to start talking about Orbit. It's been an intense few years of development and I'm really glad to be able to put it out into the world.

But first, the good stuff. Our alpha build is now [available for download](https://orbitauth.com/download). While some of the interesting pieces are not ready, we pushed hard to get it to where you can use it somewhat reliably and give feedback.

So, what's Orbit? Let's start with our mission:

> To create a new [aggregation platform](https://stratechery.com/2017/defining-aggregators/) that gives control back to the individual over their web data by creating a flexible, powerful and intuitive knowledge platform.

Orbit is a new type of thing. I think it's actually easiest to understand it as an answer to a question:

What is preventing us from exploring our knowledge like Iron Man?

![iron man](http://gradschoolguru.com/wp-content/uploads/2017/01/Iron-Man-Movie-Prologue-Hologram.jpg)

<div class="alt">
  But ergonomically, how long can you keep your arms up like that?
</div>

Yes, the fancy effects are a distraction. But these sci-fi interfaces grasp at a real desire: a level of fluidity, cohesion, and flexibility that browsers just don't give us today.

> We wanted [sci-fi interfaces](https://www.youtube.com/watch?v=PJqbivkm0Ms), instead we got 100 browser tabs.

You read, you write, you email, you chat, you work. From Slack to Jira to Google Docs to Github. Your knowledge base is distributed and Wikis and Intranet systems don't integrate with it. In fact they add yet another source of truth, and therefore staleness.

Orbit won't make you Iron Man yet (nor will it have nearly as cool visual effects), but it starts to solve the underlying pain point:

**I want to be able to explore knowledge in a unified way.**

To do that that, I think it needs to do a few things. Beyond a good product, it needs to become popular enough that it can actually convince the various SaaS players to play along. It needs to be a compelling platform for them and it's users.

Orbit is not a service company: it doesn't store any data itself. It's much closer to a Browser or Operating System. I think of it as a smart knowledge assistant. Where Operating Systems gave us a lot of control and with _files_, and browsers gave us great collaboration, Orbit gives you the middle ground: control and exploration, without losing collaboration.

It's goals are to let you:

- Navigate important knowledge quickly and easily.
- Search it intuitively: by person, topic, and time.
- Have it augment you as you normally work, in context.
- Install and build new apps on top of it with ease.
- Do all of this without having to give up our privacy and security.

<div class="demo-image"></div>

<div class="alt">
  An example Topic Explorer for Github app opened from the Orbit Home
</div>

From here on out I'm going to go into a bit more depth. You can skip to the end if you just want to get [more information on how to follow us](#going-forward).

### Distribution: From Roadblock to Selling Point

Orbit wants to replace clunky and stale intranet systems today. To do that, it needs to crawl a ton of your information. But that creates a misaligned incentive that we discovered early in user research:

_No one wants to trust any single company with all of their data._

Yea... of course! We couldn't get even our friends to install a trial version of it. They needed permission from high up. And trying to install an on-premise server would mean even more cumbersome convincing.

We wanted to build a better knowledge tool, not a competent sales team.

It was later during a discussion that we came across a realization: todays computers are powerful. They have large disks and fast processors. Doing topic modeling and search with modern ML is now approachable, fast, and space-efficient.

It was possible we could run Orbit entirely on the users computer, locally. It would be harder in some ways (we'd need a decentralized sync system), but it also give us some huge advantages:

- No handling of user data means easy, risk-free trials.
- No need to deploy servers on-prem means no need for a sales-forward company!

It meant we could avoid doing a high-trust-needed cloud service or expensive-to-deploy on-prem install.

<div style="margin: 2.5rem -20%; display: flex; align-items: center; justify-content: center;">
  <div style="margin: auto;  max-width: 100vw;">
    <img alt="On-Device = Data stays on your computer" src="./illustration.svg" />
  </img>
</div>

So, that's the innovation of Orbit's distrbution model. It never sends your data or even your keys outside of your computer. That means you can download and try it without having to trust us: you can entirely firewall Orbit!

But it also has a huge benefit for incentives within our company. It means **the product must actually be good**. We can't hide behind a sales team.

### The Technical Bits

#### Home

The Orbit Home is your flexible unified knowledge launcher. For now it's a lot like Spotlight with some recent activity and a directory of people.

<div style="width: 480px; border-radius: 20px; overflow: hidden; position: absolute; right: -560px;">
  <img alt="Orbit Home" src="./home.jpg" />
</div>

> Use Option+Space to open Orbit anywhere

#### Bit

We're calling a "file" in orbit a "Bit". Where SaaS products have data behind unique interfaces and APIs, Orbit apps sync to a common fundamental unit: the bit, which can represent Text, HTML, Tasks, Conversations, and more.

#### Language

Orbit comes with a [state of the art](https://arxiv.org/pdf/1803.08493.pdf) natural language engine. Importantly, it runs quickly on-device and is custom to your knowledge: it's relevancy is powered by interesting words in English as well as their relative frequency in your corpus. This powers search, related items, and interesting word extraction.

#### Context

Context will be the first big step Orbit makes to deliver on the "future of computing" promise. Powered by a novel OCR engine that focuses on one thing: being fast. We're close to having it to use <1% of your laptop battery.

Why an OCR engine? It means no matter if you're writing an email in Mail.app, talking on Slack, browsing the Web, or doing anything on your computer, Orbit understands what you are looking at, down to the lines you write.

Combined with the Language engine, it means Orbit can do _meaningful search_ to find extremely relevant items within your knowledgebase based on whatever you're doing. But that's just the start. Context is not yet available in Orbit, but it's close.

#### Apps

Some apps come out of the box: Gmail, Google Docs, Github, Slack, Jira, and Confluence. We will add more flexible ones next such as Web and API crawlers.

<div style="display: flex; flex-flow: row; height: 120px; max-width: 100%; justify-content: space-between; padding: 30px 0;">
  <img class="icon" src="./icons/gdrive.svg" />
  <img class="icon" src="./icons/github.svg" />
  <img class="icon" src="./icons/gmail.svg" />
  <img class="icon" src="./icons/jira.svg" />
  <img class="icon" src="./icons/confluence.svg" />
  <img class="icon" src="./icons/slack.svg" />
</div>

But we can't predict what apps and views on them will be most useful due to the incredible stochasticity of information and its uses. But I do think we can build a set of APIs that enable building those experiences.

So with all these pieces in place, we're aiming at releasing an App Store early next year. We'll expose Language and Context, and combine it with our UI Kit and an one-click decentralized distribution. Which means you can build and deploy apps to your team with no tooling, no infrastructure, and an amazing UI out of the box.

### Going forward

There's a lot more I'd like to write, but I think is more than enough to start. I'll end with something that will risk sounding cliché:

The biggest feature of Orbit is trust. If you don't feel it will respect your privacy in the long run, it wont get off the ground. Much like a Browser or Operating System, it should be a fundamental tool you trust to handle sensitive information.

We've designed it in the only way we know that guarantees that for now: by never sending data off your device. As we go decentralized we'll have to continue to make good security decisions.

Of course, trust doesn't matter if your product doesn't meet real needs. The next feed months will be exciting as we attempt to do that. I'm happy to have you on board early, and your feedback will be the most important part of ensuring that!

[Here is my email](nate@tryorbit.com). Please send me any and all inquiries, requests and bugs.

[Here is our roadmap](). We will update it about once a week.

[Here is our Slack room](). Please do join for more unstructured discussion.

I am very excited to start sharing progress with you all.

<br />
