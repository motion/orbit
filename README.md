# motion-starter

A bootstrap repo for creating full-featured modern web apps. Based on our company's app structure, simplified and extracted.

What you get:

- all those annoying first steps done and polished
- mono-repo: share code between all apps
- [motion](https://github.com/motion/motion): our build tool
- [gloss](https://github.com/motion/gloss): 💅 css in js
- a set of decorators:
  - `view` injects necessary helpers, customizable
  - `store` also adds helpers
- a dead simple router
- awesome model system:
  - [rxdb](https://github.com/pubkey/rxdb) = pouchdb + rxjs
  - automatic rxjs => mobx
- database: couchdb
  - dockerized and ready
- auth: superlogin
  - both server and client

## Install

```sh
git clone git@github.com:motion/starter.git

cd starter
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
