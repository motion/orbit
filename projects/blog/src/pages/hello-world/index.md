---
title: Update One
date: '2018-09-29T22:12:03.284Z'
---

It's about time! I'm really excited to start talking about Orbit. It's certainly been an intense few years of development, and it feels really great to reach the point where I can start to speak more about it.

I'll start with the most exciting part. We have [our first alpha build]() ready to download. Give it a try. While some of the most interesting parts are barely working, we have pushed hard to get it to where everything we want to do over the next year is roughly in place, auto updates, and looks and feels close to what we want.

Let's start with the mission:

> To create a new [aggregation platform]() for your information that shifts power back to the user -- with more flexible, powerful, contextual apps and triggers.

### Orbit, The Product

Orbit is a complement (or perhaps the mid-point between) your Browser and your Operating System. At it's core it's a better way to explore, find, and generally assist you with your knowledge. But it's also trying to change the world as it is today: a world where you have _almost no control over your information_.

Or, why can't we build Minority Report interfaces for our companies?

> We were promised [sci-fi interfaces](https://www.youtube.com/watch?v=PJqbivkm0Ms), and we were given one-hundred and fourty-four browser tabs.

I want to live in a world where:

- You can navigate all your interesting information in one place.
- You can explore and search that information with ease.
- You can see who is doing what and who is good at what, across your services.
- You can augment what you are doing, in context, with your knowledge.
- You can build and use apps that to unify, extend, enhance it.
- You can do all of this without having to expose your data to a 3rd party company.

So, how do we get there? Orbit makes the bet that by being uniquely user-aligned in incentives (with data privacy as a primary feature), with a unique on-device approach, and of course clearing a high bar in product design, we can make it happen.

Before explaining in any more depth, a demo is worth about ~60,000wps:

[video]

You can think of Orbit as your friendly personal knowledge assistant. It understands handling diverse amounts of sensitive information _can't be done in the cloud_, it's just bad incentive alignement. It also understands people want solutions and not hand-wavy promises, so we are focusing intensely on making the product useful and able to adapt to diverse needs.

Because Orbit runs privately on-device, we _never touch your data, even the keys!_ It essentially runs in a decentralized fashion, passing over it's settings to your new devices as we support new platforms and teams.

It's not just a pitch for Silicon Valley, it's also a great way to allow people to "test the waters". A risk-free trial where you can test out Orbit forces us into a far better incentive structure:

1. We have nowhere to hide! The product must speak for itself, as there is no lock-in.
2. You can test it out before committing any money.
3. You can actually firewall Orbit, guaranteeing your data's privacy.

I think this solves what would have been a near-impossible distribution story for a very early stage startup. But I understand that distribution is only half the battle. I'd like to break down Orbit a little more.

## How Orbit works

#### Bit

Where _x_ SaaS products have data behind _x_ different interfaces, Orbit requires its apps to sync data into a common fundamental unit: the **bit**. A bit to Orbit is like a file to an operating system. It allows Orbit to search, view, and unify disparate data.

#### Home

The Orbit Home is essentially its Start Menu / Spotlight / Siri. It's your Minority Report interface, powered by bits of information. Right now it shows recent activity, a Directory of people, and your Search bar.

#### Language

Orbit comes with a brand new and [state of the art](https://arxiv.org/pdf/1803.08493.pdf) Natural Language engine. Importantly, it runs extremely quickly and is custom to you: it determines interesting words relative to both English and their frequency of usage in your corpus.

Further, it powers on-device search and related items in Orbit and its apps.

#### Context

Context, or augmented computing, will be the first big step for Orbit to feel magical and deliver on the "future of computing" we want to deliver.

It starts with a custom OCR engine we've built that focuses on one thing: being the fastest in the world. We've gotten it down to under 180ms for scanning a large and dense page of text and we have a clear path to haiving it use less than 1% of your total laptop battery when always-on.

What does it mean? When writing an email, talking on Slack, browsing the Web, reading a Jira ticket, or really doing anything you do on your computer, Orbit can understand what you are looking at.

Combined with the NLP engine, it can also do _meaningful search_ to find extremely relevant items within your knowledgebase.

Or rather, _it will_. We have both the OCR and NLP working, but want to spend a few more months cooking it so it is actually useful. Luckily we found an amazing developer who has joined us to specifically to help with this, and it's exciting to see it start to become stable.

I wanted to mention it now, though, becuase it's relevant to this next section.

#### Apps

Some beautiful apps come out of the box: Gmail, Google Docs, Github, Slack, Jira, and Confluence. We plan to add some more flexible ones as well soon including generic Web and API apps.

But Apps can be so much more powerful. More powerful than I think we can ever predict, especially given the incredible stochasticity of information.

So we are focusing on just putting the right building blocks in place, and then opening up an App Store to everyone. The blocks will include the Language and Context engines, as well as our extremely mature UI kit and some other interesting pieces. Much more to come here.

### Going forward

There's a lot more I'd like to write about as time goes on. I'll end with this, at the risk of sounding cliche.

I think the biggest feature of Orbit is trust. Orbit won't succeed if it tries to be a traditional company. If you don't feel it will respect your privacy, we've already lost. Orbit will need to be positioned akin to a Web Browser or Operating System. In effect, a fundamental tool that you trust to handle sensitive information. This is very important.

We've designed it in the only way I can think that guarantees that: by handling all data on-device, and never having it send any data outside your computer.

It will be up to our communication and execution to prove that. But I want to also remember that a promise doesn't matter if you don't have a truly great product. The next feed months will be very exciting, to see if we can round out this vision.

[Here is our roadmap]().

I am very excited to start sharing our progress with you all.

<br />
