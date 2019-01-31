import { User } from '../interfaces/User'

export const userDefaultValue: User = {
  name: 'Me',
  spaceConfig: {},
  settings: {
    hasOnboarded: false,
    openShortcut: 'Option+Space',
    autoLaunch: true,
    autoUpdate: true,
    theme: 'automatic',
  },
}
