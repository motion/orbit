import { SettingRepository } from '.'

export const generalSettingQuery = () => {
  return SettingRepository.findOne({ type: 'general', category: 'general' })
}

export const accountSettingQuery = () => {
  return SettingRepository.findOne({ type: 'account', category: 'general' })
}
