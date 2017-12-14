import { uniq } from 'lodash'
import rawTasks from './tasks'
import rawConvos from './conversations'
import rawDocs from './docs'

const tasks = rawTasks.map(title => ({
  title,
  body: '# ' + title,
  integration: 'github',
  type: 'task',
}))

const mdToTitle = md => md.split('\n')[0].slice(2)
const docs = rawDocs.map(body => ({
  title: mdToTitle(body),
  integration: 'google-docs',
  type: 'document',
  body,
  url: 'http://docs.google.com',
}))

const convos = rawConvos.map(convo => {
  const title =
    'chat between ' +
    uniq(convo.messages.map(({ author }) => author)).join(', ')

  return {
    title,
    // integration: convo.type,
    integration: 'google-docs',
    type: 'document',
    // type: 'conversation',
    body: `# ${title}
  ${convo.body}`,
    url: 'http://slack.com',
  }
})

const deliverx = [
  {
    title: 'Late deliveries map',
    type: 'website',
    integration: 'pin-site',
    url: 'http://deliverx.com/map',
  },
  {
    title: 'Drivers',
    type: 'website',
    integration: 'pin-site',
    url: 'http://deliverx.com/drivers',
  },
]
console.log('convos are', convos)
export default [...tasks, ...convos, ...docs, ...deliverx]
