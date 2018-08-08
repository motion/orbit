type Config = {
  ports: {
    server: number
    bridge: number
    swift: number
  }
}

let config: Config

export function getConfig(): Config {
  return config
}

export function setConfig(nextConfig: Config) {
  if (config) {
    throw new Error('Already set config once!')
  }
  config = Object.freeze(nextConfig)
}
