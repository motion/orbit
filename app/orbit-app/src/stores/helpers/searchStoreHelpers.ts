import { SettingRepository } from '@mcro/model-bridge'
import * as Helpers from '../../helpers'

export const getPermalink = async (result, type) => {
  if (result.type === 'app') {
    return result.id
  }
  if (result.integration === 'slack') {
    const setting = await SettingRepository.findOne({ type: 'slack' })
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

export const uniq = arr => {
  const added = {}
  const final = []
  for (const item of arr) {
    if (!added[item.id]) {
      final.push(item)
      added[item.id] = true
    }
  }
  return final
}

export const matchSort = (query, results) => {
  if (!results.length) {
    return results
  }
  const strongTitleMatches = Helpers.fuzzyQueryFilter(query, results, {
    threshold: -40,
  })
  return uniq([...strongTitleMatches, ...results])
}
