import { DriveSyncer } from './DriveSyncer'

export default {
  id: 'drive',
  name: 'Drive',
  runner: DriveSyncer,
  interval: 1000 * 60 * 5, // 5 minutes
}
