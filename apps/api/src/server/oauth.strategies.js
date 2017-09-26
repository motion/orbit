import { Strategy as GithubStrategy } from 'passport-github'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import SlackStrategy from './passportSlack'

export default {
  slack: {
    strategy: SlackStrategy,
    config: {
      credentials: {
        callbackURL: '/auth/slack/callback',
        clientID: '19222037265.219986189088',
        clientSecret: '281011e25d0c473136b4caa5807ada6d',
      },
      options: {
        scope: [
          'identity.basic',
          'identity.email',
          'identity.avatar',
          'identity.team',
        ],
      },
    },
  },
  github: {
    strategy: GithubStrategy,
    config: {
      credentials: {
        callbackURL: '/auth/github/callback',
        clientID: '9afb7a8f8758557ca884',
        clientSecret: 'eb53a07f613eb07f4fa4db96845bae813ec2c01f',
        scope: ['user:email', 'notifications', 'repo', 'read:org'],
      },
    },
  },
  google: {
    strategy: GoogleStrategy,
    config: {
      credentials: {
        callbackURL: '/auth/google/callback',
        clientID:
          '97251911865-qm0isevf5m3omuice4eg3s4uq9i99gcn.apps.googleusercontent.com',
        clientSecret: 'LLXP2Vq36socQtgXy_XQqLOW',
      },
    },
    options: {
      scope: [
        'profile',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/calendar',
      ],
      accessType: 'offline',
      prompt: 'consent',
    },
  },
}
