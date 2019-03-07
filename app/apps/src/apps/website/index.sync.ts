import { WebsiteSyncer } from './WebsiteSyncer'

export default {
  id: 'website',
  name: 'Website',
  runner: WebsiteSyncer,
  interval: 1000 * 60 * 5, // 5 minutes
}
