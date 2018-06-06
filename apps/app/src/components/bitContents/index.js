import { BitSlackConversation } from './slackConversation'
import Document from './document'
import Mail from './mail'
import App from './app'
import { PersonCard } from './personCard'
import { Person } from '@mcro/models'

const results = {
  slack: {
    conversation: BitSlackConversation,
  },
  google: {
    mail: Mail,
    document: Document,
  },
  apps: {
    app: App,
  },
}

export default function getBitContentView(bit) {
  if (bit instanceof Person) {
    return PersonCard
  }
  if (!bit.integration || !bit.type) {
    return ({ children }) => children(bit)
  }
  const resolveIntegration = results[bit.integration]
  const resolver = resolveIntegration && resolveIntegration[bit.type]
  if (!resolver) {
    console.warn('no resolver for', bit.integration, bit.type)
    return () => <div>no resolver</div>
  }
  return resolver
}
