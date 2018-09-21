# creating apps

1. "new"
2. creates a new folder in your ~/.orbit/[appname]
3. inside that folder it symlinks orbit API stuff
4. opens your editor to that directory
5. has a README.md there

# Example app: Article Micropayments

This app would highlight interesting people on screen and then show a view next to them:

```ts
export class MyApp {
  myTopics = ['machine learning']

  highlightInterestingPeople = react(
    () => Screen.activeApp.words,
    async words => {
      const people = await Directory.findPeople(words)
      const peopleTopics = await all(people.map(Person.getRecentBits).map(Language.importantWords))
      const interestingPeople = []
      for (const [index, topics] of peopleTopics.entries()) {
        if (Language.distance(topics, this.myTopics) < Language.Distance.Similar) {
          interestingPeople.push(people[index])
        }
      }
      const interestingPeopleWordIndex = interestingPeople.map(name => words.indexOf(name)))
      Screen.highlightWords(interestingPeopleWordIndex, {
        onHighlight: word => App.show(MyApp, word)
      })
    },
  )

  render() {
    return (
      <App></App>
    )
  }
}
```

This app would use the Screen, OCR, and Payment APIs:

```ts
class MicroPaymentsApp {
  logActivity = on(
    () => {
      every(1000)
      if (Screen.activeWindow.type === 'browser') {
        return Screen.activeWindow.getAttribute('url')
      }
      return false
    },
    url => {
      ensure('viewing legit text on site', OCR.isViewingText && OCR.isActivelyViewing)
      const lastBit = await Bit.findOrCreate({
        url,
        lastText: OCR.currentText,
      })
      lastBit.totalTimeReading += 1
      await lastBit.save()
      console.log('spent another second on', url)
    },
  )

  sendMicroPayment = on(
    () => observe(Bit),
    bit => {
      // every 10 seconds, send payment
      if (bit.totalTimeReading - bit.totalTimePaidFor > 10) {
        Payment.escrow(bit.url, { amount: 1 / 10 })
      }
    },
  )
}
```

## ~/.orbit/apps/myapp

folder structure, the "[appname]/orbit" is a symlink

- orbit/
  - models/
  - ui/
  - (... other APIs)
- app/
  - main.tsx
- sync/
  - main.tsx

and then opens pundle, puts you into "dev mode":

- Orbit shows a simple grid of items from your sync

  - at the top has input for appname
  - at the bottom some controls:
    - [reset data][publish]

- a new App window shows your preview app

theres a conflict between two types of apps:

1. "singular" "dataless" app, just shows a single view
2. "peek" app, just shows a small view into some piece of data

we need to resolve that simply...

# Onboard

Download Orbit.app
Set it up for yourself!

If you want to create a custom feed for your team:

1. Add feed integration (RSS or DB/Api etc)
2. Configure it's incoming, name, filters

Hit "Share my Orbit"...

What it does:

1. This will share your configuration but not your integrations!
2. So you can share it any people will just set up the same integrations as you so its scoped to their privacy.
3. If you'd like to configure any integrations as global you can in preferences.

How it works:

By default you are in a Personal Orbit. But you can have many Orbits.

Orbits are collections of:

- Apps (not including the secure logins)
- Screens

# App

- Basically just a syncer + some views

# Screen

- Basically a named pane that with custom streams
- Stream:
  - Just a search
  - Can be a filter by integration, location, keywords

The owner of an Orbit is a dictator over his App/Screen settings.

You can switch between Orbits incredibly easily and manage them from your preferences pane.

# Manage Orbit

A classic preference pane. Orbits have a uniqueid that you can set.

They don't have a password, they can be private and only allow specific usernames in.

# Username

Username first means its end-user focused and can spread organically. You never leave your username.

Unlike Slack which is team-focused. With one username you can join many orbits. Not having many different passwords and profiles, just the one you want.
