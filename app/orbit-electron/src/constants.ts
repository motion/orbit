import { join } from 'path'

export const IS_MAIN_ORBIT = process.env.SUB_PROCESS === undefined
export const IS_SUB_ORBIT = !IS_MAIN_ORBIT

export const WEB_PREFERENCES = {
  nativeWindowOpen: true,
  // experimentalFeatures: true,
  transparentVisuals: true,
  allowRunningInsecureContent: false,
  webSecurity: false,
}

export const ROOT = join(__dirname, '..')
