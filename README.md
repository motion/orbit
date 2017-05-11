a base starter stack that gives you magical powers.

on order of time it saves you:

- monorepo: `bin/*` that automates your whole dev env
- kubernetes + minikube
  - `dev start`, `dev restart api`, `dev ssh api` and so on...
  - `prod [arg]`, handles your production instance
- pimped out react
  - webpack, babel, lodash, and a host of common things
- amazing store system
  - co-located stores with the least boilerplate syntax possible:
  - automatic observables through mobx
  - automatic streams to observables
  - super simple to write, test, debug
- amazing views
  - @view decorator gives you simplicity + power
  - view helpers: `this.setTimeout`, `this.watch`, etc
  - 💅 css in js with [gloss](https://github.com/motion/gloss)
- amazing models
  - a model system build on top of [rxdb](https://github.com/pubkey/rxdb)
  - gives you full power of pouchdb
  - offline first!
  - share between backend/frontend
- dockerized infrastructure
  - api with express, cors, etc configured
  - api superlogin
  - couchdb

## Install

```sh
git clone git@github.com:motion/starter.git

cd starter
npm i
npm run bootstrap
```

## Running

Run these side-by-side:

```sh
dev start
```

```sh
npm run watch
```


## Docs

### file structure

### routes

### pages

### views

### stores

### libraries


instead of **fetch** use Rx.Observable.getJSON(). why? you can cancel it!

```js
 const obs = Observable.ajax.getJSON(`/users/${id}`)
  .subscribe(user => {
    this.setState({ user });
  })

obj.unsubscribe()
```
