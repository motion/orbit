export type GlobalConfig = {
  isProd: boolean
  paths: {
    root: string
    appStatic: string
    userData: string
    nodeBinary: string
    dotApp: string
  }
  urls: {
    authProxy: string
    server: string
  }
  version: string
  ports: {
    server: number
    bridge: number
    swift: number
    dbBridge: number
    oracleBridge: number
  }
}

let config: GlobalConfig

export function getGlobalConfig(): GlobalConfig {
  return config
}

export function setGlobalConfig(nextConfig: GlobalConfig) {
  if (config) {
    throw new Error('Already set config once!')
  }
  config = Object.freeze(nextConfig)
}
