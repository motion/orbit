import SlackConversation from './slackConversation'
import Document from './document'
import Mail from './mail'
import App from './app'

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
  if (!result.integration || !result.type) {
    console.log('no result.type or result.integration', result)
    return () => <div>no result.type</div>
  }
  const resolveIntegration = results[result.integration]
  const resolver = resolveIntegration && resolveIntegration[result.type]
  if (!resolver) {
    console.error('no resolver for', result.integration, result.type)
    return { title: '' }
  }
  return resolver
}
