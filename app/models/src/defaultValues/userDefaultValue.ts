import { User } from '../interfaces/User'

export const userDefaultValue: User = {
  name: 'Me',
  spaceConfig: {},
  appState: {},
  settings: {
    hasOnboarded: false,
    openShortcut: 'Option+Space',
    autoLaunch: true,
    autoUpdate: true,
    theme: 'automatic',
  },
}
