# 🔫 🔫  dual wield meteor in a box

- motion meets webpack
- kubernetes + minikube + docker
  - `(dev|prod) start`, `(dev|prod) restart api`, `dev ssh api`...
- mobx stores
  - co-located stores
  - observables | streams => mobx
- [gloss 💅](https://github.com/motion/gloss)
- helpers: `this.setTimeout`, `this.watch`, etc
- [rxdb](https://github.com/pubkey/rxdb)
  - offline first!
  - shared models
  - superlogin
  - couch 2

## install

```sh
git clone git@github.com:motion/starter.git

cd starter
npm i
npm run bootstrap
```

## run

Run these side-by-side:

```sh
compose up
run web
run watch
```

then hit: http://jot.dev

## debug

To ssh into a docker container:

```sh
compose exec pad-api /bin/bash
```

## wield out

🔫 🔫
