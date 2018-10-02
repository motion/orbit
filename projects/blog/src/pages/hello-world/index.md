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

Operating Systems used to give us a lot more flexibility than The Cloud of today. We could for the most part take files and use them across different apps. We could search across all our information.

But Operating Systems were replaced by browser tabs, and for all the incredible good thats done, the trend has been anti-Iron-Man. I think there's room for a platform that fixes that: by mandating apps on it sync their "data" to a common form in exchange for some really compelling abilities.

I want to live in a world where:

- You can navigate related knowledge under one interface.
- You can be confident your information is complete, accurate, up to date.
- You can explore it flexibly: by people, topics, time, etc.
- You are augmented as you work: seeing contextually relevant information.
- You can explore, correlate, build, script and extend it.
- You can do all of this without having to expose your data to any external company.

That's a tall order and Orbit doesn't do all of this yet. Here is what it does do today:

[video]

### Orbit, The Strategy

Orbit wants to be a _really good platform for knowledge management_, replacing clunky and stale intranet systems of today. To do that, it has to have access to basically all of your information.

But there's a misaligned incentive there. People don't want to trust a single company with all of their data. But a knowledge platform really should have everything!

We thought we'd reached a roadblock. It was hard to get anyone to install it, even as a trial. We we're stuck at distribution.

It took a lot of exploration to realize something though. Computers today are fast, powerful, and have lots of disk space. The knowledge that's actually important to you is often not very large at all. What if we could run Orbit privately, entirely on your computer, and avoid having any cloud or on premise server?

By doing this, Orbit would de-risk "testing the water". You can actually firewall Orbit so it only has access to sync data directly from your integrations: Gmail, Confluence, Slack and the like.

That would mean:

1. You can try it risk-free: both in cost and security, unlike the cloud.
2. There's absolutely no sales cycle or "install" process, unlike on-prem.

And with that, we realized, we'd naturally land into a much better incentive structure! A risk-free trial means **the product must actually be good**. We can't hide behind a sales team.

I think this solves what would have been a near-impossible distribution story for a very early stage startup that's trying to unify your data.

### Orbit, In Detail

[Skip to the end](#going-forward) if you aren't interested in feature-level details! This section goes into some of what we've built and are planning to build.

#### Bit

We're calling a "file" in orbit a "Bit". Where SaaS products have data behind unique interfaces and APIs, Orbit apps sync to a common fundamental unit: the bit, which can be text or HTML, for now.

#### Home

The Orbit Home is your starting point. It will aim to be the Tony Stark interface, powered by bits of information. For now it's a lot like Spotlight with some recent activity and a directory of people.

> Option+Space opens your Orbit Home

#### Language

Orbit comes with a [state of the art](https://arxiv.org/pdf/1803.08493.pdf) Natural Language engine. Importantly, it runs quickly on-device and custom to you: it's relevancy is powered by both interesting words in English as well as their relative frequency in your corpus. This powers our search, related items, and interesting word extraction.

#### Context

Context, or augmented computing, will be the first big step for Orbit to feel magical and deliver on the "future of computing" experience we want to deliver.

It's powered by a custom OCR engine we've built that focuses on one thing: being the fastest in the world. We've gotten it down to under 180ms for scanning a large and dense page of text and we have a clear path to improve! It will use <1% of your total laptop battery.

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
