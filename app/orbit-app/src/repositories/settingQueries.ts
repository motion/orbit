import { SettingRepository } from '.'

export const accountSettingQuery = () => {
  return SettingRepository.findOne({ type: 'account', category: 'general' })
}
