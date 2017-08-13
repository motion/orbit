import * as Constants from '~/constants'

const dbServer = {
  protocol: Constants.DB_PROTOCOL,
  host: Constants.DB_HOST,
  user: Constants.DB_USER,
  password: Constants.DB_PASSWORD,
  publicURL: Constants.DB_PUBLIC_URL,
  userDB: 'users',
  couchAuthDB: '_users',
}

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
    sessionLife: 86400 * 365,
    // The amount of time a password reset token is valid for
    tokenLife: 86400,
    // The maximum number of entries in the activity log in each user doc. Zero to disable completely
    userActivityLogSize: 10,
    loginOnRegistration: true,
    loginOnPasswordReset: true,
  },
  userModel: {
    // For example, this will require each new user to specify a valid age on the sign-up form or registration will fail
    whitelist: ['homeLayout'],
    // validate: {
    //   age: {
    //     presence: true,
    //     numericality: {
    //       onlyInteger: true,
    //       greaterThanOrEqualTo: 18,
    //       lessThan: 150,
    //       message: 'You must be an adult, but not dead yet.'
    //     }
    //   }
    // }
  },
  local: {
    // Send out a confirm email after each user signs up with local login
    sendConfirmEmail: true,
    // Require the email be confirmed before the user can login
    requireEmailConfirm: false,
    // If this is set, the user will be redirected to this location after confirming email instead of JSON response
    confirmEmailRedirectURL: '/',
    // Set this to true to disable usernames and use emails instead
    emailUsername: true,
    // Custom names for the username and password fields in your sign-in form
    // usernameField: 'user',
    // passwordField: 'pass',
    // // Override default constraints
    // passwordConstraints = {
    //   length: {
    //     minimum: 6,
    //     message: "must be at least 6 characters"
    //   },
    //   matches: 'confirmPassword'
    // }
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
      private: ['documents'],
    },
  },
  session: {
    adapter: 'redis',
    redis: {
      url: Constants.REDIS_URL,
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

  providers: {
    slack: {
      callbackURL: 'http://api.jot.dev/auth/slack/callback',
      credentials: {
        callbackURL: 'http://api.jot.dev/auth/slack/callback',
        clientID: '19222037265.219986189088',
        clientSecret: '281011e25d0c473136b4caa5807ada6d',
      },
      options: {
        callbackURL: 'http://api.jot.dev/auth/slack/callback',
        scope: [
          'identity.basic',
          'identity.email',
          'identity.avatar',
          'identity.team',
          //'users.profile:read',
          //'usergroups:read',
          //'users:read',
          //'channels:read',
        ],
      },
    },
    github: {
      credentials: {
        clientID: '9afb7a8f8758557ca884',
        clientSecret: 'eb53a07f613eb07f4fa4db96845bae813ec2c01f',
        scope: ['user:email'],
      },
    },
  },

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
