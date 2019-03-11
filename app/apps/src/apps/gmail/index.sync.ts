import { GMailSyncer } from './GMailSyncer'

export default {
  id: 'gmail',
  name: 'Gmail',
  runner: GMailSyncer,
  interval: 1000 * 60 * 5, // 5 minutes
}
