## updates to beliefs

After talking to daniel (YC/Greplin) and stuart and charlie (Workday):

- Just search is good if done uniquely well
  - Peeks being good and very fast more important
  - Highlights within the list results more important
  - General smoothness of app more important
  - Use context to power the home page
    - Recent things youve talked about
    - Recent conversations
    - Recent things youve looked at
    - Use all that to power the home relevancy search
- Focus on knowledge internally not personal (Confluence > Gmail)
  - Crawler more important
  - Adding multiple integrations necessary
- Need to have at least a story for cross platform/mobile
  - React native mobile
  - Need to figure out good strategy for mobile
- Need to have good story for larger companies
  - May need to see about doing some cloud stuff

# Jun 25th

Talked to Rahul (Uber), Jeff (Deloitte), Ariel (Hulu):

- They have issues with internal search
- They built their own custom intranet systems (DeloitteNet)
- Rahul thinks Docs especially seeing updates is the hardest
  - he consistently has to keep 10 tabs open to track docs
- Rahul also thinks after that hooking into APIs would be best
  - this is actually a huge advantage for Orbit, building a custom API search integration doesn't seem easy with a big cloud or on prem service, even if only for feedback loop of development. Plus firewall issues.
  - We can basically let them query whatever endpoint they want and return it in a format we set up to help us rank.
- Jeff and Ariel both hate the intranets but didn't get too much more from them, it's perhaps a minor positive that they seem pretty interested overall.

# Jul 6th

Talked to James (Juul):

- Profiles are really big especially for onboarding
- Showing recent collaborations
- Making it easy to explore whats going on with people
- Not much slack search important for them
- Our platform play is very much closer to windows/ios than to slack
  - Slack integrations have no access to _other_ data within a company
  - Slack integrations have no security
  - Slack integrations can't really query internal database/apis
  - Slack integrations can't have any custom interface

# Jul 13th

Talked to Raymond (startup person)

- https://retool.in/
- Excited by DHT / shared apps

# Jul 18th

Talked to Michael Shade (Stripe Home)

- Resonance in order:
  - Onboarding / Profiles + Contextual Search (+ Highlights somewhat)
  - Personal assistant
  - Company vocab / defining terms
  - Highlight peoples names on screen to see them
  - Text expansion or actions within a company
- Feels it makes a really great personal product and could then expand to teams
- Sees a management layer similar to data warehouse tools being part of that
  - Basically flows to connect your integrations together (see the various graph interfaces)
- Just person and document search is valuable enough
- They are building internal tools that use internal apis
  - but he couldnt see using orbit to deploy it
  - likely because super easy availability there is important
  - for example, customer success uses chromebooks for cost
  - also he mentioned this could be because he hasn't seen the product
- They are building a sort of data warehouse thing
- Mentioned he couldn't use it on work laptop due to extreme security, but off hand and ran out of time

# Aug 7th

Talked to Patrick Gray

- His diff in excitement between July and Now is 2 orders of magnitude at least
- Thought we had no vision before, thinks this is one of the best now
- He's especially resonant on:
  - Private internal tooling
  - Making it "feel like Minority Report"
- Upweight:
  - ++++ User experience and feeling of control
