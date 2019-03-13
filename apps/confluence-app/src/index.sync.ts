import { ConfluenceSyncer } from './ConfluenceSyncer'

export default {
  id: 'confluence',
  name: 'Confluence',
  runner: ConfluenceSyncer,
  interval: 1000 * 60 * 5, // 5 minutes
}
