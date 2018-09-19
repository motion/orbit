import { loadOne } from '@mcro/model-bridge'
import { SettingModel } from '@mcro/models'

export const getPermalink = async (result, type?) => {
  if (result.type === 'app') {
    return result.id
  }
  if (result.integration === 'slack') {
    const setting = await loadOne(SettingModel, { args: { type: 'slack' } })
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
