- motion + webpack
- kubernetes + minikube + docker
  - `(dev|prod) start`, `(dev|prod) restart api`, `dev ssh api`...
- mobx stores
  - co-located
  - automagical
- [gloss 💅](https://github.com/motion/gloss)
- helpers: `this.setTimeout`, `this.watch`, etc
- [rxdb](https://github.com/pubkey/rxdb)

## install

```sh
git clone git@github.com:motion/starter.git

cd starter
npm i
npm run bootstrap
```

After install you can just run `bootstrap` to update packages as long as dotenv is working. See `bin/*` folder for all commands.

## run

Run these side-by-side:

```sh
build --watch
run backend
run web
```

then hit: http://jot.dev

## debug

To ssh into a docker container:

```sh
compose exec pad-api /bin/bash
```
