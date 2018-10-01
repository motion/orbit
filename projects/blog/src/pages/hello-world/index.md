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

The question is: why can't we build Minority Report interfaces for our companies?

> We were promised [ridiculously cool sci-fi interfaces](https://www.youtube.com/watch?v=PJqbivkm0Ms), and we were given one hundred browser tabs.

I want to live in a world where:

- You can navigate all your interesting information in one place.
- You can explore and search that information with ease.
- You can augment what you are doing, in context, with your knowledgebase.
- You can build and use any app you can dream of on top of it.
- You can do all of this without ever exposing your data to a 3rd party company.

So, how do we get there? I think Orbit, by way of being uniquely user-aligned in the fundamental way it's built (ie: decentralized and private to your computer), has the potential to do it. But before explaining socractically, a demo is worth about 60,000 words per second:

[video]

So, you can think of Orbit as your friendly personal knowledge assistant. It's big insight is that if you want to handle large amounts of sensitive information for people you _can't do it in the cloud_. The incentives are misaligned: you want a knowledge tool that syncs everything, but you also want any one company to handle as little as possible.

So Orbit runs privately, on your device and _never touches your data, even the keys!_

This it's not just a nice feature for users. It also means you can try it completely risk free, without even needing to confirm your email.

But Orbit wouldn't be much if it didn't work well.

## How it works

#### The Bit

Where your cloud services have data abstracted behind N unique interfaces, Orbit apps are required to sync data into a common fundamental unit: **the Bit**. A bit is a lot like a file: just a piece of content.

#### NLP

Orbit comes with a brand new and state of the art Natural Language engine. Importantly, it runs on-device extremely quickly and it's custom to you: it determines interesting words not relative to English but relative to their usage within your corpus.

Further, it does both Search and Relevancy. In effect: we a powerful meaning-based engine that works at many levels and can be used by your apps.

#### Context

Context will be the first big step for Orbit to really feel magical and deliver on the "future of computing" we want to try and deliver.

We've built a nifty OCR engine that focuses on one thing: being the fastest in the world. We've gotten it down to under 200ms for scanning a large and dense page of text, and we have a clear path to making it even better. It will use less than 1% of your total laptop battery when always-on.

When you're writing an email, talking on Slack, browsing the Web, or reading a Jira ticket, Orbit can augment any of these things and show you relevant items from your memory.

Or rather, _it will_. We have this in near-alpha form, but want to spend a few more months cooking it so it is actually useful. Luckily we've hired an amazing developer who is perfectly suited to the task, and has already started to supercharge it.

I wanted to mention it now though, becuase it's relevant to the next section.

#### Apps

Some beautiful apps come out of the box: Gmail, Google Docs, Github, Slack, Jira, and Confluence. We plan to add some more flexible ones as well soon: a Web crawler, a REST and GraphQL API crawler, and a simple scripted one.

But Apps can be so much more powerful. More powerful than I think we can ever predict, especially given the incredible stochasticity of information.

So we are focusing on just giving you the right building blocks, and then opening up an App Store. Those primiteves include the NLP and Context engines, but they will also have a variety of other nicely done pieces. I'll be writing about these more in time.

#### Sync

Orbit syncs by default using a few heuristics to keep space on your device from being filled too quickly. For example one of them, since it has NLP built in, is that it will determine if a Bit looks somewhat relevant to things happening across the last 6 months of activity.

#### Home

The Orbit Home is essentially your Start Menu / Alfred / Spotlight / Siri. It's the Minority Report interface for your Bits. Right now it just shows you recent activity and lets you search. As time goes on, we hope to make it more intelligent, intuitive, and flexible.

### Going forward

We think the biggest feature of Orbit is Trust. Orbit won't succeed if it tries to be a traditional company. It needs to be akin to a Web Browser or Operating System. In effect, a fundamental tool that handles you information. You absolutely have to be able to trust it.

So we've designed it in the only way I can think that guarantees that: by never even having it send data outside your computer.

Further, it certainly could be standardized to allow other implementation much like Browsers and OS's interop. There's some ideas floating around this. You could even run your own Orbit Box in your closet to manage your data. I don't mind it contributing to competition by foseting open standards. Our mission is to return power to users over their information.

Now, outside all the hand waves and promises it's up to us to deliver on what doesn't exist quite yet: making a truly great product. That excites me. Here is our roadmap.

I am very excited to share the next steps with you all.

<br />
