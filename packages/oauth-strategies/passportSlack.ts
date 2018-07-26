var util = require('util')
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy

function Strategy(options, verify) {
  options = options || {}
  options.tokenURL = options.tokenURL || 'https://slack.com/api/oauth.access'
  options.authorizationURL =
    options.authorizationURL || 'https://slack.com/oauth/authorize'
  // options.scopeSeparator = ','
  options.scope = options.scope || [
    'channels:history',
    'channels:read',
    'files:read',
    'groups:history',
    'groups:read',
    'im:history',
    'im:read',
    'links:read',
    'mpim:history',
    'mpim:read',
    'search:read',
    'team:read',
    'usergroups:read',
    'users:read',
    'users:read.email',
  ]
  options.skipUserProfile = true

  this.profileUrl =
    options.profileUrl || 'https://slack.com/api/users.identity?token=' // requires 'identity.basic' scope
  this._team = options.team

  OAuth2Strategy.call(this, options, verify)
  this.name = options.name || 'slack'

  // warn is not enough scope
  // Details on Slack's identity scope - https://api.slack.com/methods/users.identity
  if (!this._skipUserProfile && this._scope.indexOf('identity.basic') === -1) {
    console.warn(
      "Scope 'identity.basic' is required to retrieve Slack user profile",
    )
  }
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy)

/**
 * Retrieve user profile from Slack.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `slack`
 *   - `id`               the user's ID
 *   - `displayName`      the user's full name
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  if (!accessToken) {
    throw new Error('error')
  }
  // this._oauth2.setAccessTokenName('token')

  this.get(this.profileUrl + accessToken, function(err, body) {
    if (err) {
      return done(err)
    } else {
      try {
        var profile = JSON.parse(body)

        if (profile.user && profile.user.email) {
          profile.emails = [{ value: profile.user.email }]
          profile.user.emails = [{ value: profile.user.email }]
        }

        if (!profile.ok) {
          if (profile.error) {
            done({ message: profile.error })
          } else {
            profile.error = null
            done(null, profile)
          }
        } else {
          profile.provider = 'slack'
          profile.id = profile.user.id
          profile.displayName = profile.user.name
          profile.error = null
          profile._raw = body

          done(null, profile)
        }
      } catch (e) {
        done(e)
      }
    }
  })
}

/** The default oauth2 strategy puts the access_token into Authorization: header AND query string
 * which is a violation of the RFC so lets override and not add the header and supply only the token for qs.
 */
Strategy.prototype.get = function(url, callback) {
  this._oauth2._request('GET', url, {}, '', '', callback)
}

/**
 * Return extra Slack parameters to be included in the authorization
 * request.
 *
 * @param {Object} options
 * @return {Object}
 */
Strategy.prototype.authorizationParams = function(options) {
  const team = options.team || this._team
  const params: { scope?: string; team?: string } = {
    scope: options.scope || this._scope,
  }
  if (team) {
    params.team = team
  }
  return params
}

export default Strategy
