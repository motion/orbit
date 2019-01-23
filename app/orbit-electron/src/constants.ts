import { join } from 'path'

export const WEB_PREFERENCES = {
  nativeWindowOpen: true,
  experimentalFeatures: true,
  transparentVisuals: true,
  allowRunningInsecureContent: false,
  webSecurity: false,
}

export const ROOT = join(__dirname, '..')
