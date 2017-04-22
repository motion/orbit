let CONFIG

if (process.env.NODE_ENV === 'production') {
  // PRODUCTION
  CONFIG = {
    couchUrl: 'https://mirai.cloudant.com:443',
  }
} else {
  // DEVELOPMENT
  CONFIG = {
    couchUrl: 'http://localhost:5984',
  }
}

export default {
  ...CONFIG,
  name: 'username',
  password: 'password',
}
