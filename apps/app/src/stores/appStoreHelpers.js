import { Setting } from '@mcro/models'
import * as Helpers from '~/helpers'
import * as Constants from '~/constants'
import * as r2 from '@mcro/r2'

export const checkAuths = async () => {
  const { error, ...authorizations } = await r2.get(
    `${Constants.API_URL}/getCreds`,
  ).json
  if (error) {
    console.log('no creds')
  }
  return authorizations
}

export const getPermalink = async (result, type) => {
  if (result.type === 'app') {
    return result.id
  }
  if (result.integration === 'slack') {
    const setting = await Setting.findOne({ type: 'slack' })
    let url = `slack://channel?id=${result.data.channel.id}&team=${
      setting.values.oauth.info.team.id
    }`
    if (type === 'channel') {
      return url
    }
    return `${url}&message=${result.data.messages[0].ts}`
  }
  return result.id
}

// note: importing services causes hell for some reason
export const allServices = {
  slack: () => require('@mcro/services').SlackService,
  drive: () => require('@mcro/services').DriveService,
  github: () => require('@mcro/services').GithubService,
}

// const log = debug('root')

export const uniq = arr => {
  const added = {}
  const final = []
  for (const item of arr) {
    if (!added[item.identifier || item.title]) {
      final.push(item)
      added[item.title] = true
    }
  }
  return final
}

export const matchSort = (query, results) => {
  if (!results.length) {
    return results
  }
  const strongTitleMatches = Helpers.fuzzy(query, results, {
    threshold: -40,
  })
  return uniq([...strongTitleMatches, ...results].slice(0, 10))
}

export const prefixes = {
  gh: { integration: 'github' },
  gd: { integration: 'google', type: 'document' },
  gm: { integration: 'google', type: 'mail' },
  sl: { integration: 'slack' },
  m: { type: 'mail' },
  d: { type: 'document' },
  c: { type: 'conversation' },
}

export const parseQuery = query => {
  const [prefix, rest] = query.split(' ')
  const q = prefixes[prefix]
  if (q && rest) {
    return {
      rest: query.replace(prefix, '').trim(),
      conditions: Object.keys(q).reduce(
        (query, key) => `${query} AND ${key} = "${q[key]}"`,
        '',
      ),
    }
  }
  return { rest: query, conditions: '' }
}
