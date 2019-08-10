import { Bridge, BridgeOptions, proxySetters } from '@o/mobx-bridge'
import { AppMeta } from '@o/models'
import { decorate, deep } from '@o/use-store'

// store export
export let Desktop = null as DesktopStore

export type OSThemes = 'dark' | 'light'

@decorate
class DesktopStore {
  bridge = Bridge
  setState = Bridge.setState
  sendMessage = Bridge.sendMessage
  onMessage = Bridge.onMessage
  source = 'Desktop'

  state = deep({
    workspaceState: {
      packageIds: [] as string[],
      identifierToPackageId: {},
      appMeta: {} as { [identifier: string]: AppMeta },
      developingAppIdentifiers: [] as string[],
    },
    errorState: {
      title: '',
      message: '',
      type: 'null' as 'warning' | 'error' | 'null',
    },
    onboardState: {
      foundSources: {},
    },
    operatingSystem: {
      theme: 'light' as OSThemes,
      trayBounds: {
        size: [0, 0],
        position: [0, 0],
      },
      accessibilityPermission: false,
      macVersion: null,
      supportsTransparency: false,
    },
    movedToNewSpace: 0,
  })

  start = async (options?: BridgeOptions) => {
    await Bridge.start(this, this.state, options)
  }

  dispose = Bridge.dispose
}

Desktop = proxySetters(new DesktopStore())
Bridge.stores['Desktop'] = Desktop
