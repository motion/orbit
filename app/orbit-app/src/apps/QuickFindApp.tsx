import { createApp } from '@o/kit'

export default createApp({
  id: 'quickFind',
  icon: 'quickFind',
  name: 'Search',
  app: QuickFindApp,
})

function QuickFindApp() {
  return <div>hi</div>
}
