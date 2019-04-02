import { App, appStartupConfig } from '@o/stores'

export function getAppState() {
  const { allApps } = App.state
  console.log('ALL APPS', JSON.stringify(allApps))
  return allApps.find(x => x.id === appStartupConfig.appId)
}
