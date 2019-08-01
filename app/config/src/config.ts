// see setGlobalConfig for where this is set up

export type GlobalConfig = {
  isProd: boolean
  paths: {
    cli: string
    appEntry: string
    orbitConfig: string
    desktopRoot: string
    appStatic: string
    userData: string
    nodeBinary: string
    dotApp: string
    resources: string
    desktop: string
  }
  urls: {
    auth: string
    authHost: string
    server: string
    serverHost: string
  }
  version: string
  ports: {
    graphServer: number
    server: number
    bridge: number
    swift: number
    screenBridge: number
    ocrBridge: number
    mediator: number
    desktopMediator: number
    workersMediator: number
    electronMediators: number[]
    auth: number
    authProxy: number
    apps: number[]
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

// persisted config
export * from './configStore.node'
