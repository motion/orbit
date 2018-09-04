import { SettingRepository } from '.'

export const generalSettingQuery = {
  where: { type: 'general', category: 'general' },
}

export const accountSettingQuery = () => {
  return SettingRepository.findOne({ type: 'account', category: 'general' })
}
