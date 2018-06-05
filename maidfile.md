## run

Run a commany in any `apps/app` folder, defaults to `start`. To run every app in dev mode for example just do:

```
maid run app
maid run desktop
maid run electron
```

which will end up running:

```
cd apps/app && npm run start
cd apps/desktop && npm run start
cd apps/electron && npm run start
```

But you can run any arbitrary npm command inside any package here too by using the fourth argument. So, `maid run app build` would run `npm run build` inside `apps/app`.

```bash
echo "hi"
cd apps/$1 || cd packages/$1 || echo "not found" && exit 1
pwd
```
