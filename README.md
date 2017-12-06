## install

```sh
bin/bootstrap
```

## run

```sh
build # only need to do this once and then you can just...
build --watch
# once watch is running, in another terminal...
run web
```

then go to http://orbit.dev

## build

Going to production has mostly been automated. We still need to work on making
these commands a lot more consistent, but for now it's not too bad.

### Production web app:

```
# send production web app to http://seemirai.com
build web
deploy web
```

### Production electron app:

This builds Orbit.app. Orbit.app runs internally the api + electron app, and for
now loads the web app from http://seemirai.com):

```
# build production electron app to apps/electron/app
build electron
# test it with:
run electron --prod
# push it to release servers
deploy electron
```

## apps

We have a few things that interact.

### API

The API runs on your desktop next to your app, handling things like OAuth,
static file serving, and some small glue between the various apps. It's
generally run automatically behind the scenes and you don't need to worry about
it.

### Electron

This runs using react + electron, which uses @mcro/reactron. Manages the
windows.

### Web

This is the app logic itself, which generally runs in the electron container.
