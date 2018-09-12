// see setGlobalConfig for where this is set up

export type GlobalConfig = {
  isProd: boolean
  paths: {
    desktopRoot: string
    appStatic: string
    userData: string
    nodeBinary: string
    dotApp: string
    resources: string
  }
  urls: {
    auth: string
    authProxy: string
    server: string
    serverHost: string
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

// only can set once
export function setGlobalConfig(nextConfig: GlobalConfig) {
  if (config) {
    throw new Error('Already set config once!')
  }
  config = Object.freeze(nextConfig)
}
