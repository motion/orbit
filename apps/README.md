## Structure

- **api**: Your server, runs express + superlogin and anything else you need
- **couch**: Couchdb docker config
- **helpers**: View/Store helpers, used in many places
- **models**: Powered by RxDB + some helpful abstractions, can be used anywhere
- **views**: Throw in views that can be shared by web/mobile/native
- **web**: Your web app
