---
title: Update One
date: '2018-09-29T22:12:03.284Z'
---

_Note: this is a message for early insiders, please don't share the link. I'll be going into detail on future product and distribution plans._

I'm excited to start talking about Orbit. It's been an intense few years of development and it feels great to finally get it into the world. What we have now is just the start, but many cool pieces are almost ready.

First, the good stuff. An alpha build is now [available for download](https://orbitauth.com/download). We've pushed hard to get it to where it's usable and we can get valuable feedback.

---

So... what is Orbit? Let's start with a story:

You read, you write, you email, you chat, you work. From Slack to Jira to Google Docs to Github. Your knowledge is distributed -- but your wiki and intranet portal don't keep up. They add another source of truth, and infrastructure. They are clunky to use and chronically stale.

There's something wrong here. It's best explained by the gap between the futuristic sci-fi interfaces we've seen for decades in TV and film and the way we work today.

> We wanted [sci-fi interfaces](https://www.youtube.com/watch?v=PJqbivkm0Ms), instead we got 100 browser tabs.

![iron man](http://gradschoolguru.com/wp-content/uploads/2017/01/Iron-Man-Movie-Prologue-Hologram.jpg)

<div class="alt">
  Ergonomically though, how long can you really keep your arms up like that?
</div>

While the fancy effects of movies like Iron Man and Minority Report are often distracting, they grasp at a real unmet desire: a level of unification, fluidity, and control that browsers and the web just don't give us today.

This brings us to Orbit's mission:

> To create a new [aggregation platform](https://stratechery.com/2017/defining-aggregators/) that gives control over web data back to the individual -- with a flexible, powerful and intuitive knowledge platform.

It's a basic desire we ran into time and time again in user research:

**"I want to be able to understand my knowledgebase, and I can't."**

For the last two years we've been building something to help solve this problem. It fixes a pain point browsers and cloud services fail at today: they don't give us any control over our information.

In order to right that, Orbit is a platform and not a service. We don't store data. Instead, much like a browser or operating system, Orbit just helps explore and manage existing information. Traditional operating systems gave us a lot of control (with _files_) where browsers give us collaboration (and _lock in_). Orbit moves control back to us by running privately on your device - a decentralized knowledge explorer. It's a flexible platform for managing bits of information from many places.

Our goal is to let you:

- Navigate disparate knowledge quickly and easily.
- Search intuitively: by person, topic, and time.
- Augment yourself with relevant information as you work.
- Build and install apps on top of it with ease.
- Do all of this without giving up privacy or security.

<div class="demo-image"></div>

<div class="alt">
  An example Topic Explorer for Github app opened from the Orbit Home
</div>

### Distribution: From Roadblock to Selling Point

[Skip to the Product section](#the-product) if you don't care for backstory and distribution model.

Orbit wants to replace clunky and stale intranet systems of today. To do that, it needs to crawl a ton of your sensitive information. But, therein lies a misaligned incentive (one we discovered early in user research):

_No one wants to trust any single company with all of their data._

Close friends wouldn't even install early trial versions of Orbit without permission from their team. We wanted to build a better knowledge tool, but having it live in the cloud or on-prem would mean difficult onboarding and thus a heavy sales need.

But todays computers are powerful. They have lots of memory. Topic modeling and search with modern NLP is orders of magnitude faster and easier to do than just a couple years ago. We realized with just a bit more care towards compute power we could run Orbit entirely locally on your computer. That meant:

- No handling of user data - risk-free trials.
- No need for on-prem server - low onboard cost.

<div class="graphic">
  <div style="margin: auto;  max-width: 100vw;">
    <img alt="On-Device = Data stays on your computer" src="./illustration.svg" />
  </img>
</div>

Today when you download Orbit it realizes this plan, without some of our decentralized sync system. It never sends a bit of your data outside your computer, you can use your firewall to be sure.

### The Product

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

We can't predict what apps and views will be most useful for any one person or company, though. As we finish each of the above mentioned parts, along with our interface kit, we're going to release the App Store (hopefully early next year).

You'll have full access to the Language and Context APIs, our UI Kit, People, and importantly, a built in live-editing environment that lets you one-click decentralized deploy it with no infrastructure required.

### Going forward

There's a lot more I'd like to write, but I think this is more than enough to start. Right now Orbit is buggy and incomplete, but the underlying technology is all there. It took a ton of hard problem solving to get it to where it is, and it's really well set up to move quickly now. I look forward to all of your bug reports :).

[Here is my email](mailto:nate@tryorbit.com) send me any and all inquiries, requests, issues.

[Sign up to the mailing list](https://tryorbit.com) for blog update emails ~monthly.

[Join our Slack room]() and [the download link again](https://orbitauth.com/download), for those who missed it.

Let's start a revolution!

<br />
