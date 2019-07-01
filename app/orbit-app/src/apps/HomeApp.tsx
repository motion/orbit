import { createApp } from '@o/kit'

export default createApp({
  id: 'home',
  icon: 'home',
  name: 'Home',
  app: HomeApp,
})

function HomeApp() {
  return <div>hi</div>
}
