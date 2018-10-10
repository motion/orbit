UMED:

- finish web crawler
- team account / management
- search relevancy - build a dataset, test, improve, use cosal, etc

* multiple highlights not working in search results

NEXT:

1. Redesign, get umed working on teams as much as possible
2. fix filters
3. keyboard shortcut for filters as well
4. QuickResults - not just people but any bit, have peek open automatically on search!
5. improve keynav a lot with moving through peek
6. keyboard shortcut reference toggle pane
7. improve performance a lot so things arent lagging at all
8. make keyboard shortcuts more clear as well to people
9. improve peek display quite a bit
10. probably search virtual masonry
11. get switch orbits smooth

- NOT decentralized to start...
- it just syncs metadata "ids" and such to our servers...
- One person manages an Orbit

# Signup / Teams

## Step 1, basic teams

Basically we will have this onboard process:

_Onboarding_

It has the following steps:

1. Add some integrations
2. It uses those integrations to search for any existing Spaces
3. If it finds them, it shows you them and lets you click "join"
4. If you are approved to join them (by being inside an approved integration, say, Slack) then you are let in
5. Done

Now you will be taken to your home screen. It will show you how to switch spaces (CMD+K to switch easily). By default you are on your personal Space. You can select to go to our space (the Orbit space).

When you do it reads a configuration for that Space and sees which Integrations you should have:

- ['slack/motion-core', 'github/motion', 'drive/motion', ...]
- if you are missing any of those integrations it shows a banner at the top of the Home area:

"You have 2/5 integrations, please add the rest >>>"

- That links to the Settings > Team pane where it shows apps you "should have" and you can add them.

_Creating a Space_

If you can't join any spaces it will prompt you to create a space. This is the same screen you'd see when creating a space normally through Settings > Team > Create New...

It shows a form:

- "name" input
- pick a colored Orb icon
- add some integrations
- you can choose which integrations are the "authenticator" integrations (Slack, GDrive, Gmail, Github for now...)
- Create button

Then it can show you a link to invite people, maybe offer to post it in Slack #general if it's slack.

## Step 2, management features

_Pinning_

We can allow people to do two thigns:

1. Pin a search to the "pinned searches"
2. Pin an item within a search to that search

If they do 1 then that searchs shows up on the pinned list. It will look like a queue much like the old home with the little queues, except they can manage the queues.

If they do 2 it will just show it in the top quick results queue that lives above every search. Eventually we can allow sorting of that as well but for now it will just go to the top of that queue.

# Teams

Teams will need shared config. It will look like this:

```js
{
  id: 0,
  members: [{ id: 0, permission: 'read', }, ...],
  setting: {
    topics: [{ name: 'string' }, ...],
    pinned: [ ... ],
    ...
  }
}
```

It will basically drive most of the UI. I just don't like the verbosity of how we do things now. This config will live shared between everyone in a p2p system. We'll have to investigate more how that works and the best libraries for this. This highly depends on the library probably, and we maybe even just persist it to disk as json.

But I think a good first step is to make a really simple API for the client to basically not have to think about too much. It should basically just let you observe this object and change it super simple. For now it can go into our Setting.general thing.

NEXT

1. OCR search demo with cosal
2. Create apps distribute via p2p
3. Home redesign for apps:
4. Apps + Person have a new app design like the demo app:
   1. Sidebar shows their top topics
   2. Main view has Locations in tabs
   3. Main view shows topic \* location bits for that person
5. AppleScript 2.0:
   - Ridiculously easy to build apps
   - Pundle power built right into Orbit
   - Apps have two views:
     - Main and Peek
     - Main is the big app on homescreen
     - Peek is the one you see from searches
   - Apps can Sync
   - Apps have Triggers
   - Apps have cool APIs:
     - NLP (words, relevancy, search)
     - Triggers:
       - Words
       - Concepts
       - URLs/App state

- remove "archived" gmail
- Really simple throttle to keep cpu from going too much
- GDocs auto sync most things by default

# next

- cmd+z to undo, necessary for suggestions to work otherwise you click one and you cant undo
- suggestions also don't properly work, click 'status' and it doesnt highlight, you can click status again
- p2p libs: https://news.ycombinator.com/item?id=18077312 https://github.com/libp2p/js-libp2p
- could open a special link type: orbit://gD7sadhgasdy78aDT7
- test if we dont need cloud oauth https://laravel.com/docs/5.6/valet#securing-sites
- website docs https://github.com/pedronauck/docz https://github.com/gatsbyjs/gatsby/tree/master/www/src/pages
- Location as a model
  - This way we can search + generate feeds by Location
- manage people (may not want github for example to sync in people)
  - probably by default some integrations are "additive only"
  - so they only sync in on top of existing people
  - also could scan contacts
- typing while focused on a peek:
  - reset index to 0 not -1, keeps the peek open as you filter things
- clicking location buttons should filter that location
- clicking a name should search that name
- find by type (file / link is helpful)
- search results date strategy:
  - do separators based on time periods:
  - do by day for first week within the current month
  - do by month after that
- Fix empty profiles from gmail contacts import
  - Toggle select all button in table view
- fix highlight index click interaction
- fix integration buttons styling and going inactive after click
- cmd+z undo in search area (needs to work with toggles...)
- peek arrow position shouldn't straddle weird borders
- hoverGlow needs fix for x/left just like top/y
- @mcro/color: increaseContrast, decreaseContrast
- hmr: doesn't store.unmount stores often
