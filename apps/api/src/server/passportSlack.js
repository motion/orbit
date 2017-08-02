var util = require('util')
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy

function Strategy(options, verify) {
  options = options || {}
  options.tokenURL = options.tokenURL || 'https://slack.com/api/oauth.access'
  options.authorizationURL =
    options.authorizationURL || 'https://slack.com/oauth/authorize'
  // options.scopeSeparator = ','
  options.scope = options.scope || [
    'identity.basic',
    'identity.email',
    'identity.avatar',
    'identity.team',
  ]

  this.profileUrl =
    options.profileUrl || 'https://slack.com/api/users.identity?token=' // requires 'identity.basic' scope
  this._team = options.team

  OAuth2Strategy.call(this, options, function(...args) {
    console.log('incoming', args, 'outgoing', verify(...args))
    return verify(...args)
  })
  this.name = options.name || 'slack'

  // warn is not enough scope
  // Details on Slack's identity scope - https://api.slack.com/methods/users.identity
  if (!this._skipUserProfile && this._scope.indexOf('identity.basic') === -1) {
    console.warn(
      'Scope \'identity.basic\' is required to retrieve Slack user profile'
    )
  }

  console.log('strategy', this)
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
  console.log('first get', accessToken, arguments)
  // this._oauth2.setAccessTokenName('token')

  this.get(this.profileUrl + accessToken, function(err, body, res) {
    if (err) {
      return done(err)
    } else {
      try {
        var profile = JSON.parse(body)

        console.log('got back profile', profile)

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
          profile._json = profile
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
  console.log('get', url)
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
  var params = {}
  var team = options.team || this._team
  if (team) {
    params.team = team
  }
  console.log('auth params', options)
  return params
}

/**
 * Expose `Strategy`.
 */
export default Strategy
