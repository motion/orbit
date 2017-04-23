const IS_PROD = process.env.NODE_ENV === 'production'

export default {
  name: 'username',
  password: 'password',
  couchUrl: IS_PROD ? 'https://mirai.cloudant.com' : 'http://localhost:5984', //'https://jot-app-api.herokuapp.com/couch',
}
