import { GMailSyncer } from './GMailSyncer'

export default {
  runner: GMailSyncer,
  interval: 1000 * 60 * 5, // 5 minutes
}
