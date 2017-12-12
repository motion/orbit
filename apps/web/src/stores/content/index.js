import rawTasks from './tasks'
import rawDocs from './docs'

const tasks = rawTasks.map(title => ({
  title,
  body: '# ' + title,
  integration: 'github',
}))

const mdToTitle = md => md.split('\n')[0].slice(2)
const docs = rawDocs.map(body => ({
  title: mdToTitle(body),
  integration: 'docs',
  body,
}))

export default [...tasks, ...docs]
