we need a basic way to search packages

plan is:

1. we'll run our own verdaccio at app/registry
2. in cli
   1. on `orbit publish`, if we get a successful publish to verdaccio:
   2. hit a cloud function here to scan the package
   3. scan package and insert it into firestore
3. have a api search function:
   1. you can do arrayContains in firestore so we can use that as a decent search
