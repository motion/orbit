---
title: Update One
date: '2018-09-29T22:12:03.284Z'
---

_Note_: this is a message for early insiders, please don't share the link. I'll go into a bit more detail on future product and distribution plans.

I'm certainly excited to start talking about Orbit. It's been an intense few years of development and I'm happy we can start to put it out into the world.

But first, the great news. Our alpha build is now [available for download](). While some interesting pieces are not yet in place, we pushed hard to get to where you can use it and give feedback.

So, what's Orbit? Let's start with our mission:

> To create a new [aggregation platform](https://stratechery.com/2017/defining-aggregators/) that gives back control to individuals over their web data -- with a flexible, powerful and intuitive knowledge platform.

Orbit is a new type of thing. It's actually easiest to illustrate it as an answer to a question.

What is preventing us from exploring our data like Iron Man?

![iron man](http://gradschoolguru.com/wp-content/uploads/2017/01/Iron-Man-Movie-Prologue-Hologram.jpg)

<div style="font-size: 11px; text-align: center; margin: -1.5rem 0 1rem; opacity: 0.5;">
  but ergonomically, how long could you really keep your arms up like that?
</div>

And yes, the fancy effects are a distraction. But the truth is these sci-fi interfaces all grasp at one thing: a level of fluidity, cohesion, and flexibility that browsers just don't give us today.

> We wanted [sci-fi interfaces](https://www.youtube.com/watch?v=PJqbivkm0Ms), instead we got 100 browser tabs.

You read, you write, you email, you chat and you work. From Slack to Jira to Google Docs to Github. Information is becoming more and more distributed, and our knowledge is left stale in Wikis and Intranet systems that can't keep up.

Orbit won't make you Iron Man (it also won't have nearly all the cool visual effects). But it can solve a real problem that doesn't have a good solution:

**I want to be able to explore knowledge in a unified way.**

But to do that I think it needs to catch somewhat of a network effect, so it has the power to shift some control from web apps back to individuals. And do that it needs to be a compelling platform.

So, Orbit is a new type of thing: a complement to your Browser and Operating System. A smart knowledge platform. OS's gave us a lot of control and with _files_, but there is no file in the browser, and Orbit wants to re-invent that for the modern era.

We want to be able to:

- Navigate important knowledge quickly and easily.
- Search it intuitively: by person, topic, and time.
- Have it augment us, as we work, in context.
- Install and build new apps on top of it easily.
- Do all of this without having to give up our privacy and security.

[video]

From here on out I'm going to talk just a bit about what makes Orbit unique. You can skip to the end if you just want to get [more information on how to follow us](#going-forward).

### Distribution: From Roadblock to Selling Point

Orbit wants to replace most of clunky and stale intranet systems today. To do that, it needs to crawl most of your information. But that creates a misaligned incentive that we quickly discovered in our user research:

_No one wants to trust any single company with all of their data._

This was a big roadblock for us. Enterprise sales cycles felt made the large problem of building a better knowledge manager impossible. Even close friends resisted installing it without getting strong permission from their manager and team.

We couldn't get anyone to just try it out. Traditionally this would mean moving to an on-premise model, where you let a company install an Orbit server at their office to avoid security issues. But this is an even more laborious sales model.

It was later during a discussion that we came across a realization: todays computers are powerful. They have large disks and fast processors. Doing topic modeling and search with modern ML is now approachable, fast and space-efficient.

What if we could do it all on the users computer? It would be harder in some ways, but it also would solve all our issues:

- No handling of user data meant easy, risk-free trials.
- No need to deploy servers on-prem meant no need for a sales-forward company!

We'd need a decentralized sync system for it, and it certainly has its downsides. But they downsides we'rer _well suited to do_. Let's look at the three options we faced, as they stand:

1. The Cloud: Requires high trust in your security, has worse UX, but easy to build.
2. On Prem: Secure, but at high install cost and sales cycle, very hard to develop.
3. **Orbit: Decentralized/On Device** - Also secure, with low install cost and higher UX, limited compute and somewhat hard to develop.

<div style="margin: 2.5rem -20%; display: flex; align-items: center; justify-content: center;">
  <div style="margin: auto;  max-width: 100vw;">
    <img alt="On-Device = Data stays on your computer" src="./illustration.svg" />
  </img>
</div>

All of this just means you can download Orbit at no cost, with no risk. No data privacy issues, no time talking to sales, no expensive installation.

It also aligns us nicely with users: **the product must actually be good**. We can't hide behind a sales team.

### How Orbit Works

[Skip to the end](#going-forward) if you aren't interested in feature-level details! This section goes into some of what we've built and some that are in early development.

<div style="width: 480px; border-radius: 20px; overflow: hidden; position: absolute; right: -520px;">
  <img alt="Orbit Home" src="./home.jpg" />
</div>

#### Home

The Orbit Home is your flexible unified knowledge launcher. For now it's a lot like Spotlight with some recent activity and a directory of people.

> Use Option+Space to open Orbit anywhere

#### Bit

We're calling a "file" in orbit a "Bit". Where SaaS products have data behind unique interfaces and APIs, Orbit apps sync to a common fundamental unit: the bit, which can represent Text, HTML, Tasks, Conversations, and more.

#### Language

Orbit comes with a [state of the art](https://arxiv.org/pdf/1803.08493.pdf) natural language engine. Importantly, it runs quickly on-device and is custom to your knowledge: it's relevancy is powered by interesting words in English as well as their relative frequency in your corpus. This powers search, related items, and interesting word extraction.

#### Context

Context will be the first big step Orbit does to deliver on the "future of computing". It's powered by a custom OCR engine we've built that focuses on one thing: being the fastest in the world. We're close to getting it to use <1% of your total laptop battery.

Why an OCR engine? Whether writing an email in Mail.app, talking on Slack, browsing the Web, or really doing anything you do on your computer, Orbit understands what you are looking at.

Combined with our Language engine, it means we can do _meaningful search_ to find extremely relevant items within your knowledgebase based on whatever you're doing. But that's just the start. We can also highlight words and show apps next to them, and script triggers based on activity, words, and other contextual information.

We have both the OCR, NLP, and UI working. But we need a few more months to get it to be more stable, useful and well implemented.

#### Apps

Some beautiful apps come out of the box: Gmail, Google Docs, Github, Slack, Jira, and Confluence. We will add more flexible ones next such as Web and API crawlers.

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
