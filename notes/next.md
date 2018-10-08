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
