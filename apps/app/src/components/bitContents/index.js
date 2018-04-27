import SlackConversation from './slackConversation'
import Document from './document'
import Mail from './mail'
import App from './app'
import PersonCard from './personCard'
import { Person } from '@mcro/models'

const results = {
  slack: {
    conversation: SlackConversation,
  },
  google: {
    mail: Mail,
    document: Document,
  },
  apps: {
    app: App,
  },
}

export default result => {
  if (result instanceof Person) {
    return PersonCard
  }
  if (!result.integration || !result.type) {
    return ({ children }) => children(result)
  }
  const resolveIntegration = results[result.integration]
  const resolver = resolveIntegration && resolveIntegration[result.type]
  if (!resolver) {
    console.error('no resolver for', result.integration, result.type)
    return { title: '' }
  }
  return resolver
}
