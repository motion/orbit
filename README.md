# motion-starter

- mono-repo: share code between all apps
- [gloss](https://github.com/motion/gloss): 💅 css in js
- `@view` decorator
- mobx stores
- simple router
- model system:
  - [rxdb](https://github.com/pubkey/rxdb) = pouchdb + rxjs
  - automatic rxjs => mobx
- couchdb

## Install

```sh
git clone git@github.com:motion/starter.git

cd starter
npm i
npm run bootstrap
```

Be sure you have [docker-compose](https://docs.docker.com/compose/) installed.

## Running

Run these three side-by-side:

```sh
npm run web
```

```sh
docker-compose up
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
