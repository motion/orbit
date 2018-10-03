---
title: Update One
date: '2018-09-29T22:12:03.284Z'
---

I'm certainly excited to start talking about Orbit. It's been an intense few years of development and I'm happy we can start to put it out into the world.

But first, the great news. Our alpha build is now [available for download](). While some interesting pieces are not yet in place, we pushed hard to get to where you can use it and give feedback.

So, what's Orbit? Let's start with our mission:

> To create a new [aggregation platform](https://stratechery.com/2017/defining-aggregators/) that gives individuals control over siloed web data to create a more flexible, powerful and intuitive knowledge exploration.

Orbit is a new type of thing. It's a mid point between a Browser and an Operating System -- a knowledge platform that takes disparate information and makes it easier to understand, search and explore.

We see a trend in the world: the rise of cloud computing has left us with _almost no real control over our information_. One way I like to frame is is as follows.

What's preventing us from exploring our companies like Iron Man?

![iron man](http://gradschoolguru.com/wp-content/uploads/2017/01/Iron-Man-Movie-Prologue-Hologram.jpg)

<div style="font-size: 11px; text-align: center; margin: -1.5rem 0 1rem; opacity: 0.5;">
  How long can you keep your arms up like that?
</div>

> We wanted [sci-fi interfaces](https://www.youtube.com/watch?v=PJqbivkm0Ms), instead we got 100 browser tabs.

I'm not referring to the _visual effects_ of the movie. While those are ridiculous, what basically every Sci Fi movie ever does understand is the same desire we kept running into in user research:

**I want to be able to explore my company information in a unified way.**

From Slack to Jira your team Google Drive -- we love these services for what they're designed to do -- but when going about our day, it's never easy to stay up to date with them or explore our company in an easy way.

The transition to from the OS era to the Browser era has been almost exclusively anti-Iron Man. In 1999 all we used were files, and while collaboration was nonexistant, almost everything else was better: organization, search, and data portability.

We want:

- To navigate important knowledge quickly and easily.
- To be confident it's holistic, accurate, up to date.
- To slice it in natural ways: by person, topic, and time.
- To not have to think about it: with automatic augmenting in context, as you work.
- To easily manage, extend, and build apps on top of it.
- To do all of this without having to give up our privacy and security.

Orbit's goal is make this real. Here's a demo:

[video]

### Our Secret: Distribution

Orbit wants to be a _really good platform for knowledge management_, replacing clunky and stale intranet and portal systems of today. To do that, it needs to crawl all of your information. But there was a misaligned incentive here: early in development we realized no one wants to trust any single company with _everything_.

Duh!

We thought we'd reached a roadblock. Huge enterprise sales cycles didn't excite us and they weren't the problem we felt was necessary to solve. But it was impossible to get anyone to install it without wanting a big demo.

In frustration, we later had a realization: computers today are _powerful_. They have large disks and fast processors. Further, NLP algorithms have become incredibly fast.

That meant Orbit could plausibly run _entirely privately on your computer_. We'd just have to figure out a way to have it sync data between peers.

In vetting out this model we actually were very happy with it. It basically created a new model for enterprise sales, one that fit our constraints perfectly. Today you either build a Cloud service or sell a company a server they install On-premise. We wanted to make a simple desktop app with some decentralized pieces:

1. Cloud - Have to trust security, lower UX, but easy to develop.
2. On-premise - Secure, high install cost, large sales cycle, harder to develop.
3. **Decentralized/On Device** - Secure, low install cost, high UX, but limited compute and harder development.

So we tested our theory of NLP and compute power, and with some interesting work there we're confident we can do good search locally. The rest perfectly aligned with our incentives.

<div style="margin: 2.5rem -20%; display: flex; align-items: center; justify-content: center;">
  <div style="margin: auto;  max-width: 100vw;">
    <img alt="On-Device = Data stays on your computer" src="./illustration.svg" />
  </img>
</div>

In english it just means you can try Orbit at no cost and with no risk. No data privacy issues, no time talking to sales, no complex installation. Just download the app.

This also aligns us in another way: it means **the product must actually be good**. It's the alignment we love as product developers, and solves what was a near-impossible distribution story for an early stage startup.

### The details

[Skip to the end](#going-forward) if you aren't interested in feature-level details! This section goes into some of what we've built and some that are in early development.

<div style="width: 480px; border-radius: 20px; overflow: hidden; position: absolute; right: -520px;">
  <img alt="Orbit Home" src="./home.jpg" />
</div>

#### Home

The Orbit Home is a flexible unified search and exploration tool for your data. For now it's a lot like Spotlight with some recent activity and a directory of people.

> Option+Space opens Orbit Home

#### Bit

We're calling a "file" in orbit a "Bit". Where SaaS products have data behind unique interfaces and APIs, Orbit apps sync to a common fundamental unit: the bit, which can be text or HTML, for now.

#### Language

Orbit comes with a [state of the art](https://arxiv.org/pdf/1803.08493.pdf) Natural Language engine. Importantly, it runs quickly on-device and custom to you: it's relevancy is powered by both interesting words in English as well as their relative frequency in your corpus. This powers our search, related items, and interesting word extraction.

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
