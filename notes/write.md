# Counting Lines of Code is Actually a Great Metric

(for a startup)

- Ok listen, dont be dumb enough to just count them, its "one" metric that you need to have various restrictions on
- But its actually really great for a startup that involves schlep, which is just about any of them
- My advice would be to pair it with two:
  - How often you have to redo the code
  - How bloated your code is
- NOTE this really works only for product features
- If you look at your startup when its in development, theres a certain amount of code you need to write. Its unavoidable.
- So if you write X amount of code wiht Y amount of rewrites, and keep your bloat to Z%, then you can basically figure out how long it will take to be done
- And if you track your personal metrics there, you can set a goal:
  - "lines of productive code per day"
- And if you estimate the whole product is, say, 50k lines of code, and your rate is 500/day, and your churn is about 20% of that, and bloat is 15%, then you know how long it will take, in a rough sense
- NOW, what is this useful for?
  - NOT useful for estimating deadlines
  - NOT useful for improving "TEAM LEVEL" productivity
  - NOT useful for comparing with other team members
  - NOT useful if you change the "difficulty" of your code amounts really often
  - IS useful for yourself, to push yourself to be better
  - IS useful if you are isolated in one general complexity level
  - IS useful if you are doing mostly product level stuff:
    - Frontend components, building pages for your website, new forms/pages in your app, etc
- You can now easily find your moving average of productivity and motivate yourself to improve it

# Why Orbit

this can be a pretty intense and long article tbh, with a lot of detail for every section. think like other popular longform articles that go about 50 pages or so and really dive into detail

- history: reapp, flint (note: intranet work for quixey), motion, macro, mirai
- all actually shared one thing:
  - either they were trying to make development easier
  - or make app building for teams easier
  - (or mirai _was_ a large app, where we ran into issues building it)
- turns out the problems i had been solving the whole time were related to how to build apps more easily
- its not easy!
- orbit started as a knowledge management tool
  - really more knowledge augmentation
  - we wanted to make it so you would know things as you did them
- development was insanely hard
- why?
  - non-native apps are actually harder to do well then native, by a lot
  - you have to re-build everything:
    - selectable, sortable, draggable, virtual lists !!!!!
    - virtual tables with all their itracacies
    - tree views!
    - themeable resizable everything
    - popovers that can point and attach to anything, anywhere and trigger in many ways
    - etc etc etc etc
  - its easy to underestimate just how much native toolkits give you
- native IS better
  - at least on some platforms
  - mac for example has a huge and comprehensive toolkit
- BUT native sucks:
  - you have to rebuild it for every platform
  - re-compile on every save
  - a unique API for everything you do
  - different debugging tools for every platform
  - need to hire teams for basically every platform
- in the end the answer looks like this:
  - once there is a good toolkit to build on the web that solves its problems:
    - speed and breadth/depth of components, basically
  - then you have clearly the best of all worlds, for _most_ apps
    - you have fast beautiful and comprehensive toolkit
    - with the best debugging and dev experience
    - that only requires knowing one language and set of APIs
    - and deploys anywhere for free
- orbit started as an exploration of how teams work together
- mid-way through research we landed on giving teams a nice intranet
  - stripe home for your company
- but intranet systems primary function usually is custom small apps
- as we built we found its impossible to build one thing for everyone
- but if we got the toolkit right, we could make it easy to build custom apps
- and especially if we got DISTRIBUTION
  - ie: truly an app platform where we can let users store data where it exists already
  - that way we dont have tons of security issues and permissions asking

# Unsilo (Cloud Lock-In)

- looking around at the cloud theres a hell of a lot of silos
- gsuite cloud search
- only works for google services
- ms365
- only works for microsoft
- Dropbox, Jira, etc
- Our knowledge is locked into platforms
- But they don't operate in the same platforms, ideally
- slack
- confluence, intercom, etc
- how to solve lock in?
- a company dedicated to unifying cloud services.
- its _sole mission_ must be to unify the cloud
- but it has to do it without breaking permission, security.

Orbit does that.

---

# A Decentralized Intranet

- intranets solve the same problems: curation, news, search, profiles
- but they dont work how we work now: across many services
- they are always out of date, because they dont use our sources of truth
- install is a huge pain:
  - on-prem is laborious and expensive
  - cloud is insecure and creates permissions hell
- on device is the answer:
  - completely secure
  - install can be instant and painless
- p2p can sync any metadata for curation
- aggregation is the new curation
- machine intelligence for smart answers, summaries and more
- eventually deploy apps internally with ease
- Orbit

---

# Stripe Home as a Service

---

# Slack and Metcalf's Law (the N squared problem)

---

# Where is Software 2.0?

---

# The Lost Art of Deep Work

---

# The Stunning Lack of Ambition of OS X Mojave

- We were promised Software 2.0
- iOS gets: Notification noise reduction
  - where is that on OS X?
- Dark theme is the big feature
- Why does spotlight not search your cloud services?
- Does anyone use Notification center on Mac?
- This looks like a Step release
- WAIT
- Apple focusing on performance is important and good
- but it leaves room for companies doing intelligent software
- and especially for work related tooling
- desktop software doesnt work with us

---

# Anti-SaaS / No-Cloud

---

# Knowledge Management is Broken

- Confluence, MediaWiki -- Slow, Stale, Cumbersome
- Notion and other newcomers -- Just copying the old players with a slightly better interface
- Knowledge still has big problems:
  - It's hidden
  - It goes stale
  - It doesn't source Slack, Github, etc
  - It requires active searching
  - It sacrifices privacy or requires a huge install
- We're building orbit to fix all of that, [here's how it does it[(#10).

---

# Anti-Cloud, and Revolutionizing Knowledge Management

- On desktop: at hand, upgrading Spotlight
- Stale: Unifying sources, topic based grouping, cosal
- Passive search, not always active
- Aggregation of knowledge: Experts, Projects
- Private, no install

---

# Why MVPs no Longer Work for Most Things

- very Thiel article
- hard things become more important
- You can still fake the general pitch
- but as software 2.0 becomes more prevalent the quality of the product bar goes higher
- machine learning becomes more used
- interfaces are becoming more complex and require more thought
- problem sets have to integrate lots of data, bigger data, more disparate
- saturation for typical products is so high
  - can you imagine another trello coming into pm tools now?
- now startups must tackle big problems

---

# The Great Cloud Blind Spot

- on how SaaS has become over-done, and desktop software is now under-valued
- patio11 wrote an article about why desktop wasn't as good (for bingo creator)
- but his article is unpersuasive:
  - mac app store has improved and is improving more and more
  - now has easier payment story
  - so his 2x conversion is likely not as relevant
  - also some apps are great for web, but some arent
- the desktop has some big advantages:
  - better user experience
  - can be always on
  - easier to integrate with notifications
  - better shortcuts, cross-app communication
  - more power with files
  - more stickiness long term
  - easier multiprocess
  - can use python, go, rust, swift as needed

---

# The Tension between Vision and Research

- pitching something requires showing the "dream"
  - crafting a reality people want and resonate with
  - "resonation" is a super-dimensional thing
  - its hitting a dream state that is strongly desired for many reasons
- meanwhile doing market research is dividing a space
  - want to really slice which pieces you want best
- these are essentially polar opposites
- painting vs checkboxes
- some things work well as checkboxes:
  - dropbox
  - airbnb
- some things are horrible as checkboxes, but great paintings:
  - high ux: webos / ios
  - multi-featured: slack / airtable
- painting-like ideas are harder to validate
- they are also harder to execute
  - getting just a few pieces wrong can ruin a painting
- but they are also likely undervalued/underexplored
- and its a lost value in modern society due to MVP-culture
  - requires leonardo da vinci / steve jobs "many-talented execution"

---

# The Metagame is the Game

Or monetizing monetizing.

- see game dev: Star citizen, Citybound, "how to spend 7 years building a game"
- see kickstarter: long ongoing campaigns, re-raising etc
- see crypto: ico's raising on just having good updates and seeming legit

---

# I Can't Believe It's Not Native

---

# Privacy and design are your most important features

- Look at Mozilla's latest experiment (Recommendations with Laserlike)
- Look at previous cloud search companies
- Look at ugly chrome extensions with no keyboard navigation
- People forget that privacy is not just a feature, but one of the biggest features
  - It forces you to sell your product at a price which garners trust
  - It gives people the chance to try your product without compromising their data
  - It lets you do a ton more because you can now access a lot more of their data without issue
  - It reduces your liabilities and overhead of safeguarding data
  - It makes your users love you rather than hate you
- Design is the other most under-considered feature
  - Your product is almost worthless without great design, even if it's revolutionary
  - Design is not just gradients, it's speed, interaction, and all the small details
  - Good design can take 75% of your product's development time (it's harder than you think)
  - It makes people love your product and spread it organically (See Framer X)

---

# the motivational theory of software development

- you need big goalposts that are spaced out "just enough"
- you'll always have one big one in every project, "cut first beta release"
- you can count on demoralization if you don't hit a goalpost every 1-2months
- they don't need to be "big" just need to be concrete, measureable
- but also they should have some "demo" (showoff-driven-development)
- the downside of thinking this way is it can encourage feature bloat
- be sure goalposts look like this pattern:
- [hacked together/runs] => [big features] => [big refinements] => [release]

---

(Launch Post:)

# A commitment to control

- a new generation of products
- user-first as a feature
- decentralized (peter thiel reference?)
- completely private data - a first
- extensible and hackable
- release significant portion of base open source
- build value based on design, low level features, market
- survive due to get stewardship not lockdown
- the value of being user-aligned > the value of tracking data
- companies that do this will out-compete companies that don't
- software is getting mature enough to allow this to be a feature

---

# Decentralizing software

---

# Smallthoughts and Showoffs: How to build a antifragile company

- Smallthoughts and Showoffs, or Incoming and Outgoing
- Incoming: observations from the real-world, showerthoughts
- Outgoing: a channel to showoff your recent work, technical or not
- Why they matter:
- Incoming:
  - Nintendo got into video games because Gunpei Yokoi was observing someone passively hitting buttons on a calculator for amusement
  - He had a small thought: people like to play on small devices with screens
  - That small thought led to about 200+B in revenue and ongoing
  - Make a room in slack #smallthoughts
- Outgoing:
  - You're always achieving small milestones
  - It feels great to hit them, but often there's no place to release that
  - Humility is good, but you need an outlet for celebration
  - We created a #showoff room 3 years ago and it's been our "most successful" idea
  - It has many great downstream effects:
    - A small place to celebrate small and big wins
    - Lets you define your own wins: getting a technical bug is a great showoff
    - That helps the company calibrate what matters internally and builds pride
    - Is asynchronous so you can celerate as you feel the need without disrupting
    - Forces you to make things presentable and encourages doing nice screen recordings
    - Sense of unity and achievement
- Why it makes you antifragile:
  - Small thoughts bring in fresh content without "needing to be a big idea"
  - Showoff is similarly an unencumbered way to measure what people care about and keep them happy

---

# A New Deal on for Operating Systems

- WebOS
- Silos
- App building
- data needs to be separate from apps
- app building is impossible and requires heavy infrastructure

---

# Developers are bad at Vertical Integration

- Developers love small, pure, composable, blazing, etc etc
- This is great, but we have a huge problem
- We are allergic to vertical integration
- For example, we love libraries and hate frameworks
- We're willing to fragment entire ecosystems because we don't like a couple apis in a library
- This sets back our industry, big time
- We should be building more upwards, less sideways

---

# When in doubt, cleanup

- This is a development tip, but I find the same thing works for me irl
- If you feel flustered, unmotivated, unsure of next steps, braindead
- Just clean.
- Clean the last thing you did, clean up an area you don't like that totally unrelated
- This is a big productivity boost for me, as it lets my subconscious think
- Often after I "clean up" I find myself moving into my notes to take down a few ideas
- I've even often done cleaning just because I'm feeling unfocused, and often find myself "miraculously" doing something that seems totally unrelated, but unlocks my next step of work

---

# Why Orbit took so long to build

- There's a fundamental tension when building a startup:

On one hand, you need to have a "demo":
   1.  To pitch to potential co-founders and employees
   2.  To show to investors
   3.  To make sales

On the other hand, you want to build the product efficiently and risk-free:
   1.  Validate hardest techinical ideas first to see how long they will take
   2.  Sketch high level, but then build lowest level stuff before highest level, so you aren't constantly re-doing things.
   3.  One great example is a UI kit:
       1.  If you are building your app, and using custom views, putting together a Storybook-like playground first will save you innumerable  time:
           1.  You can HMR and iterate much quicker than inside a big app
           2.  You can isolate views and ensure they are well test
   4.  Plus, efficiency demands that you build certain things "together":
       1.  As you change certain structures in your app, you should update the other areas rather than let them "rot".
       2.  As you run into problems in lower levels, you should fix them when you are there, rather than adding more and more layers of hacks.

So there's this huge tension here. Which do you do?

I took a contrarian take, but I could only do it because we were post-money, and because we have incredible investors who are completely hands-off (FF).

I think this is actually one of my most contrarian takes, as at every step in a startup you will hear the following: "did you make a sale yet?", "wheres the MVP?", "why haven't you shipped something small?".

For some ideas this makes sense. For big ideas, this almost never makes any sense. If you are building the next Docker, or the next Dropbox, you will fail if you launch your product and it barely works. If you are building the next iPhone, you will fail if your touchscreen isn't smooth, and your apps don't look great. Other phones had these features, what made the iPhone stand out? It got the "big picture" and the "small details" right. It stood out.

Standing out is crucial for big ideas. A poorly done big idea is worth almost nothing, while a cohesive and well-built big idea is equally hard to ignore.

Traditionally, startups would do the following:

1. Hack together a pitch/demo/sale
2. Raise money
3. Deliver MVP
4. Attempt sales
5. Iterate 3-4 continuously


In my mind, not enough startups are doing this:

1. Hack together a pitch/demo/sale
2. Raise money
3. Build out your product until it's great
4. Keep hot leads alive, get feedback as you can
5. Attempt sales and iterate

It may not seem much different, but what happens is it gives you time to most efficiently build. It's easy to say: this is just what developers want, another reason to architect astronaut. But it's also easy to say: ship early. The truth is, if you have the right intuitions about the market, I'd bet the latter strategy will allow you launch with a 2-3x better product: and not in terms of just features or design, but in terms of market-fit. Because most products "fit" is a result of a really clear, compelling demo. And you'll know when you have it. It's far easier to build a compelling demo when you can plan to have 6-12 months of continous development, without having to put out fires for clients every week, and without having to rush to the next "demo" you want to send out. They are antithetical to each other, and while each startup is unique and you'll need *some* amount of balance between the two, I have a strong belief that in our MVP-infested culture, today, the latter is being almost wholly ignored, which means theres less competition at the "top" of the quality market for whatever product you are building.

---

# Why lines of code is actually a great metric for productivity at early startup

- obviously has some constraints
  1. depends on type of startup: needs to be heavy on product
  2. have to filter out noisy code like dependencies

- but the ground truth of it is this:
  - doing a startup is way more than just code:
    - docs
    - website
    - deployment
    - lots of services

- lines of code actually captures movement really well

- it has some good and bad incentives
- but, you can control for the bad ones easily
  - because you can codify them in the repo/CI

- good incentives:
  - no hiding, forces eyes on whats going on easily

---

# Configuring a good dev environment

- it shouldnt force you to look at things you aren't working on:
  - noEmitOnError is a Bad Thing
  - it forces you to get out of flow for small things that dont actually affect your current task
  - you can still have a rule to not allow PRs of course without no errors
