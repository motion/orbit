import { join } from 'path'

export const IS_SUB_ORBIT = process.env.SUB_PROCESS === 'orbit'

export const WEB_PREFERENCES = {
  nativeWindowOpen: true,
  // experimentalFeatures: true,
  transparentVisuals: true,
  allowRunningInsecureContent: false,
  webSecurity: false,
}

export const ROOT = join(__dirname, '..')
