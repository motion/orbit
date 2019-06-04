import { getGlobalConfig } from '@o/config'
import { Strategy as GithubStrategy } from 'passport-github'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

import SlackStrategy from './passportSlack'

const Config = getGlobalConfig()

export const OAuthStrategies = {
  slack: {
    strategy: SlackStrategy,
    config: {
      credentials: {
        callbackURL: Config.urls.auth + '/auth/slack/callback',
        clientID: '19222037265.219986189088',
        clientSecret: '281011e25d0c473136b4caa5807ada6d',
      },
    },
    options: {
      // we need this option to make this slack plugin to work without
      // adding identity.basic and other scopes
      // more info in https://github.com/mjpearson/passport-slack/issues/10#issuecomment-185813869
      skipUserProfile: true,
      scope: ['team:read', 'users:read', 'users:read.email', 'channels:history', 'channels:read'],
    },
  },
  github: {
    strategy: GithubStrategy,
    config: {
      credentials: {
        callbackURL: Config.urls.auth + '/auth/github/callback',
        clientID: 'de95d6d639ef4a013166',
        clientSecret: 'aa259c9b4ea25c22b288761e03e7f19f43b0cca6',
        scope: ['user:email', 'notifications', 'repo', 'read:org'],
      },
    },
  },
  gmail: {
    strategy: GoogleStrategy,
    config: {
      credentials: {
        callbackURL: Config.urls.auth + '/auth/gmail/callback',
        clientID: '97251911865-qm0isevf5m3omuice4eg3s4uq9i99gcn.apps.googleusercontent.com',
        clientSecret: 'LLXP2Vq36socQtgXy_XQqLOW',
      },
    },
    options: {
      scope: ['profile', 'https://www.googleapis.com/auth/gmail.readonly'],
      accessType: 'offline',
      prompt: 'consent',
    },
  },
  drive: {
    strategy: GoogleStrategy,
    config: {
      credentials: {
        callbackURL: Config.urls.auth + '/auth/drive/callback',
        clientID: '97251911865-qm0isevf5m3omuice4eg3s4uq9i99gcn.apps.googleusercontent.com',
        clientSecret: 'LLXP2Vq36socQtgXy_XQqLOW',
      },
    },
    options: {
      scope: ['profile', 'https://www.googleapis.com/auth/drive.readonly'],
      accessType: 'offline',
      prompt: 'consent',
    },
  },
}
