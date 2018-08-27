type Config = {
  userDataDirectory: string
  rootDirectory: string
  privateUrl: string
  version: string
  ports: {
    server: number
    bridge: number
    swift: number
    dbBridge: number
    oracleBridge: number
  }
}

let config: Config

export function getGlobalConfig(): Config {
  return config
}

export function setGlobalConfig(nextConfig: Config) {
  if (config) {
    throw new Error('Already set config once!')
  }
  config = Object.freeze(nextConfig)
}
