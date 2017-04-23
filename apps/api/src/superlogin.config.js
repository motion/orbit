import {
  IS_PROD,
  DB_PROTOCOL,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  REDIS_URL,
} from './keys'

export default {
  dbServer: {
    protocol: DB_PROTOCOL,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    userDB: 'sl-users',
    couchAuthDB: '_users',
  },
  mailer: {
    fromEmail: process.env.FROM_EMAIL,
    options: {
      service: 'Gmail',
      auth: {
        // TODO:
        user: 'gmail.user@gmail.com',
        pass: 'userpass',
      },
    },
  },
  userDBs: {
    defaultDBs: {
      private: ['supertest'],
    },
  },
  session: {
    // 'redis' or 'memory'
    adapter: IS_PROD ? 'redis' : 'memory',
    redis: {
      // The docker-compose will setup the /etc/hosts for us so our redis servier is called "redis"
      url: REDIS_URL,
    },
  },
  providers: {
    facebook: {
      credentials: {
        clientID: process.env.FACEBOOK_CLIENTID,
        clientSecret: process.env.FACEBOOK_CLIENTSECRET,
        profileURL: 'https://graph.facebook.com/v2.4/me',
        profileFields: [
          'id',
          'name',
          'displayName',
          'emails',
          'age_range',
          'link',
          'gender',
          'locale',
          'timezone',
          'updated_time',
          'verified',
          'picture',
          'cover',
        ],
      },
      options: {
        scope: ['email', 'public_profile'],
        display: 'popup',
      },
    },
    google: {
      credentials: {
        clientID: process.env.GOOGLE_CLIENTID,
        clientSecret: process.env.GOOGLE_CLIENTSECRET,
      },
      options: {
        scope: ['profile', 'email'],
      },
    },
    github: {
      credentials: {
        clientID: process.env.GITHUB_CLIENTID,
        clientSecret: process.env.GITHUB_CLIENTSECRET,
        scope: ['user:email'],
      },
    },
    windowslive: {
      credentials: {
        clientID: process.env.WINDOWSLIVE_CLIENTID,
        clientSecret: process.env.WINDOWSLIVE_CLIENTSECRET,
      },
      options: {
        scope: ['wl.signin', 'wl.basic', 'wl.emails'],
      },
    },
    linkedin: {
      credentials: {
        clientID: process.env.LINKEDIN_CLIENTID,
        clientSecret: process.env.LINKEDIN_CLIENTSECRET,
      },
    },
  },
}
