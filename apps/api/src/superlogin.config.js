import {
  IS_PROD,
  DB_PROTOCOL,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  REDIS_URL,
} from './keys'

const dbServer = {
  protocol: DB_PROTOCOL,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  userDB: 'users',
  couchAuthDB: '_users',
}

console.log('dbServer', dbServer)

export default {
  dbServer,
  testMode: {
    noEmail: true,
    oauthDebug: true,
    debugEmail: true,
  },
  security: {
    // Default roles given to a new user
    defaultRoles: ['user'],
    // Disables the ability to link additional providers to an account when set to true
    disableLinkAccounts: false,
    // Maximum number of failed logins before the account is locked
    maxFailedLogins: 3,
    // The amount of time the account will be locked for (in seconds) after the maximum failed logins is exceeded
    lockoutTime: 600,
    // The amount of time a new session is valid for (default: 24 hours)
    sessionLife: 86400,
    // The amount of time a password reset token is valid for
    tokenLife: 86400,
    // The maximum number of entries in the activity log in each user doc. Zero to disable completely
    userActivityLogSize: 10,
    // If set to true, the user will be logged in automatically after registering
    loginOnRegistration: false,
    // If set to true, the user will be logged in automatically after resetting the password
    loginOnPasswordReset: false,
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
    adapter: 'redis',
    redis: {
      url: REDIS_URL,
    },
  },
  //  emails: {
  //   // Customize the templates for the emails that SuperLogin sends out
  //   confirmEmail: {
  //     subject: 'Please confirm your email',
  //     // Remember to use the correct path relative to where your custom config file is located
  //     template: path.join(__dirname, './templates/email/confirm-email.ejs'),
  //     // 'text' or 'html'
  //     format: 'text'
  //   },
  //   forgotPassword: {
  //     subject: 'Your password reset link',
  //     template: path.join(__dirname, './templates/email/forgot-password.ejs'),
  //     format: 'text'
  //   }
  // },
  // providers: {
  // facebook: {
  //   credentials: {
  //     clientID: process.env.FACEBOOK_CLIENTID,
  //     clientSecret: process.env.FACEBOOK_CLIENTSECRET,
  //     profileURL: 'https://graph.facebook.com/v2.4/me',
  //     profileFields: [
  //       'id',
  //       'name',
  //       'displayName',
  //       'emails',
  //       'age_range',
  //       'link',
  //       'gender',
  //       'locale',
  //       'timezone',
  //       'updated_time',
  //       'verified',
  //       'picture',
  //       'cover',
  //     ],
  //   },
  //   options: {
  //     scope: ['email', 'public_profile'],
  //     display: 'popup',
  //   },
  // },
  // google: {
  //   credentials: {
  //     clientID: process.env.GOOGLE_CLIENTID,
  //     clientSecret: process.env.GOOGLE_CLIENTSECRET,
  //   },
  //   options: {
  //     scope: ['profile', 'email'],
  //   },
  // },
  // github: {
  //   credentials: {
  //     clientID: process.env.GITHUB_CLIENTID,
  //     clientSecret: process.env.GITHUB_CLIENTSECRET,
  //     scope: ['user:email'],
  //   },
  // },
  // windowslive: {
  //   credentials: {
  //     clientID: process.env.WINDOWSLIVE_CLIENTID,
  //     clientSecret: process.env.WINDOWSLIVE_CLIENTSECRET,
  //   },
  //   options: {
  //     scope: ['wl.signin', 'wl.basic', 'wl.emails'],
  //   },
  // },
  // linkedin: {
  //   credentials: {
  //     clientID: process.env.LINKEDIN_CLIENTID,
  //     clientSecret: process.env.LINKEDIN_CLIENTSECRET,
  //   },
  // },
  // },
}
