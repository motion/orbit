---
title: Update One
date: '2018-09-29T22:12:03.284Z'
---

I'm really excited to start talking about Orbit. It's certainly been an intense few years of development and it feels really great to reach the point of putting it out in the world.

I'll start with the big news: we have a [first alpha build](). Give it a try. While some of the interesting parts are not yet enabled, we have pushed hard to get it to where we can start getting feedback.

So, what is Orbit?

Let's start with our mission:

> To create a new [aggregation platform](https://stratechery.com/2017/defining-aggregators/) that shifts the balance of power -- from companies to individuals -- to give more flexible, powerful and inuitive control over our knowledge.

The idea is this: incentives and the way platforms are structured today hold us back from being able to collaborate, explore and extend the information we create.

### Orbit, The Product

Orbit is a new type of thing. It's the mid point between your Browser and your Operating System -- a knowledge platform that aims to take disparate information and make it easy to find, explore and understand.

It's like your own little personal assistant, keeping you up to date as you normally work.

But it's also trying to change the world as it is today: a world where you have _almost no control over your information_.

The question it's trying to answer is: why haven't we realized the flexible and powerful interfaces we were promised in Minority Report and Iron Man? Are our current intranet systems the best we can do to give our company knowledge a "home base"?

![iron man](http://gradschoolguru.com/wp-content/uploads/2017/01/Iron-Man-Movie-Prologue-Hologram.jpg)

> We wanted [sci-fi interfaces](https://www.youtube.com/watch?v=PJqbivkm0Ms), instead we got 100 browser tabs.

And I'm not talking about _fanciness_ here. While the interfaces of movies are often ridiculous and impractical (who can keep their arms up like that for more than a few minutes?), what they do get right is a level of fluidity and unification that has actually _regressed_ since the pre-internet era.

Let's boil it down. I want to live in a world where:

- You can navigate related knowledge all in one place.
- You can be confident the information is complete, accurate, up to date.
- You can explore it flexibly: by people, topics, time, etc.
- It augments you as you normally work, using what you do to show what you missed.
- You can explore, correlate, build, script and extend it.
- You can do all of this without having to expose it to a 3rd party company.

Before explaining in any more depth, here is Orbit as of today:

[video]

Operating Systems used to give us a lot more flexibility than The Cloud of today. We could for the most part take files and use them across different apps. We could search across all our information.

But Operating Systems were replaced by browser tabs, and ever since the trend has been anti-Iron-Man. I think there's room for a platform that fixes that: by mandating that apps on it sync their "data" to a common form.

If Orbit can do that well enough, we may be able to get enough demand that it will force cloud platforms to let us gain a lot more control over our data. So we can explore it how our films have always imagined it should be.

### Orbit, The Strategy

Orbit wants to be a _really good platform for knowledge management_, essentially replacing the clunky and stale intranet systems we use today. How do we get there? Orbit is making a big bet: being uniquely user-aligned is the only way to get real distribution.

It has to be _uniquely user aligned_. This isn't just some buzzword. Throughout user testing we consistenly found people hesitant to trust anyone, let alone an early startup with _all of their data_.

But by being completely private, Orbit de-risks "testing the water". A risk-free trial where you can test out Orbit leads us into a far better incentive structure for us.

It forces us to actually care about the UX. And it lets us avoid becoming a "sales first":

1. The product must sell itself by being actually good.
2. You can test it with no cost or risk to you or your company.
3. You can do this without even needing to trust our word, firewall it!

I think this solves what would have been a near-impossible distribution story for a very early stage startup that's trying to touch all your data. But I understand that distribution is only half the battle.

### Orbit, The Platform

#### The Bit

The fundamental unit of information. Where SaaS products have their data behind their own unique interfaces and APIs, Orbit requires its apps to sync data into a common fundamental unit: **The Bit**. A bit to Orbit is like a file to an operating system. It allows Orbit to search, view, and unify disparate data.

#### Orbit Home

The Orbit Home is essentially its Start Menu / Spotlight / Siri. It's your Tony Stark interface, powered by bits of information. Right now it shows recent activity, a Directory of people, and your Search bar.

> Option+Space opens Orbit Home

#### Language

Orbit comes with a brand new and [state of the art](https://arxiv.org/pdf/1803.08493.pdf) Natural Language engine. Importantly, it runs quickly on-device, and is custom to you: it's relevancy is powered by both interesting words in English as well as their relative frequency in your corpus. This powers the on-device search, related items, and interesting word extraction.

#### Context

Context, or augmented computing, will be the first big step for Orbit to feel magical and deliver on the "future of computing" experience we want to deliver.

It starts with a custom OCR engine we've built that focuses on one thing: being the fastest in the world. We've gotten it down to under 180ms for scanning a large and dense page of text and we have a clear path to haiving it use less than 1% of your total laptop battery when always-on.

What does it mean? When writing an email, talking on Slack, browsing the Web, reading a Jira ticket, or really doing anything you do on your computer, Orbit can understand what you are looking at.

Combined with the NLP engine, it can also do _meaningful search_ to find extremely relevant items within your knowledgebase.

Or rather, _it will_. We have both the OCR and NLP working, but want to spend a few more months cooking it so it is actually useful. Luckily we found an amazing developer who has joined us to specifically to help with this, and it's exciting to see it start to become stable.

I wanted to mention it now, though, becuase it's relevant to this next section.

#### Apps

Some beautiful apps come out of the box: Gmail, Google Docs, Github, Slack, Jira, and Confluence. We plan to add some more flexible ones as well soon including generic Web and API apps.

But Apps can be much more powerful and diverse than I think we can ever predict, especially given the incredible stochasticity of information and it's needs. So while I don't think we can build one solution for everyone, I do think we can provide a powerful set of APIs that enable building those experiences.

So we want to put the right building blocks in place, and begin testing our own App Store early next year. The blocks will include the Language and Context engines, some augmented features, as well as our mature UI Kit. There's much more to come here.

### Going forward

There's a lot more I'd like to write, but I think is more than enough to start.

I'll end with something that will risk sounding cliché:

I think the biggest feature of Orbit is trust. Orbit won't succeed if it tries to be a traditional startup. If you don't feel it will respect your privacy in the long run, we've lost. Orbit will need to be thought of like a Browser or Operating System: a fundamental tool you trust to handle sensitive information.

We've designed it in the only I know to guarantee that: by never sending data off your device. To realize the vision though we'll be building a decentralized sync system to let Orbit go cross-platform and multi-user.

Of course, none of this matters if we don't deliver a truly great product that meets real world needs. The next feed months will be very exciting as we attempt to deliver that.

[Here is our roadmap]().

I am very excited to start sharing progress with you all.

<br />
