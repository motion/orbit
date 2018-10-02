---
title: Update One
date: '2018-09-29T22:12:03.284Z'
---

I'm really excited to start talking about Orbit. It's certainly been an intense few years of development and it feels really great to reach the point of putting it out in the world.

I'll start with the big news: we have [our first alpha build]() ready to download. Give it a try. While some of the most interesting parts are not yet enabled, we have pushed hard to get it to where we can start getting feedback.

So, what is Orbit?

Let's start with the company mission:

> To create a new [aggregation platform](https://stratechery.com/2017/defining-aggregators/) for information that shifts the balance of power -- from the cloud back to end-users -- with flexible, powerful and beautiful abilities.

### Orbit, The Product

Orbit is a complement (or perhaps the mid-point between) your Browser and your Operating System. It's a "Knowledge OS" that gives you a better way to explore, find and augment your day to day with all your interesting information.

But it's also trying to change the world as it is today: a world where you have _almost no control over your information_.

The question it's trying to answer is: why can't we build Minority Report / Tony Stark interfaces for our information? Why are intranet systems so bleak?

> We wanted [sci-fi interfaces](https://www.youtube.com/watch?v=PJqbivkm0Ms), instead we go 100 browser tabs.

I want to live in a world where:

- You can navigate knowledge in one place.
- You can be confident it's is well sorted and up to date.
- You can explore and search with ease.
- You can see who is doing what / who is good at what, across many services.
- You are augmented in a natural way with information, in context, automatically.
- You can build and use apps that to unify, extend, enhance it.
- You can do all of this without having to expose your data to a 3rd party company.

Before explaining in any more depth, a demo is worth about ~60,000wps:

[video]

### Orbit, The Strategy

Orbit wants to be a _really good platform for knowledge management_, essentially replacing clunky intranet systems by breaking down the barrier between Cloud and OS.

So, how do we get there? Orbit is making a big bet: that being **uniquely user-aligned** will make it happen.

How? Well, Orbit runs entirely privately to you, on your computer only, and we _never touch any of your data!_

And this isn't just some techy-pitch. Throughout user testing we consistenly found people hesitant to trust _anyone_, let alone an early startup with _all of their data_.

But by being completely private, Orbit de-risks "testing the water". A risk-free trial where you can test out Orbit leads us into a far better incentive structure, by avoiding the need for leading with Sales:

1. The product must sell itself, you can trust we aren't selling you fools gold.
2. You can test it out before buying, you don't have to ante up.
3. You can actually firewall Orbit, you don't even have to trust our security promise!

I think this solves what would have been a near-impossible distribution story for a very early stage startup that's trying to touch all your data. But I understand that distribution is only half the battle.

I'd like to revisit Orbit at a slightly higher level, to finish explaining our plan.

### Orbit, In Detail

#### The Bit

The fundamental unit of information. Where SaaS products have their data behind their own unique interfaces and APIs, Orbit requires its apps to sync data into a common fundamental unit: **The Bit**. A bit to Orbit is like a file to an operating system. It allows Orbit to search, view, and unify disparate data.

#### Home

The Orbit Home is essentially its Start Menu / Spotlight / Siri. It's your Minority Report interface, powered by bits of information. Right now it shows recent activity, a Directory of people, and your Search bar.

> Use Option+Space to open Orbit Home

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

There's a lot more I'd like to write, but I think this does enough to start. I'll end with something that will risk sounding cliché:

I think the biggest feature of Orbit is trust. Orbit won't succeed if it tries to be a traditional startup. If you don't feel it will respect your privacy in the long run, we've lost. Orbit will need to be thought of much like a Web Browser or Operating System: in effect, a fundamental tool that you trust to handle sensitive information.

This is very important. We've designed it in the only way that guarantees that: by never sending data out of your device. To realize that goal we have plans to build a decentralized piece that allows Orbit to sync privately cross-platform and cross-team.

Of course, none of this matters if we don't deliver a truly great product. The next feed months will be very exciting as we attempt to deliver on that.

[Here is our roadmap]().

I am very excited to start sharing progress with you all.

<br />
