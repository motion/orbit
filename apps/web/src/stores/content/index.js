import rawTasks from './tasks'
import rawDocs from './docs'

const tasks = rawTasks.map(title => ({
  title,
  id: title,
  body: '# ' + title,
  integration: 'github',
  type: 'task',
}))

const mdToTitle = md => md.split('\n')[0].slice(2)
const docs = rawDocs.map(body => ({
  id: mdToTitle(body),
  title: mdToTitle(body),
  integration: 'google-docs',
  type: 'document',
  body,
}))

const deliverx = [
  {
    id: 'deliverx.website',
    title: 'Late deliveries map',
    type: 'website',
    integration: 'pin-site',
    url: 'http://deliverx.com/map',
  },
  {
    id: 'deliverx.map',
    title: 'Drivers',
    type: 'website',
    integration: 'pin-site',
    url: 'http://deliverx.com/drivers',
  },
]

export default [...tasks, ...docs, ...deliverx]
