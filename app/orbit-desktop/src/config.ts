type Config = {
  env: {
    prod: boolean
  }
  server: {
    url: string
    host: string
    port: string
  }
  directories: {
    root: string
    orbitAppStatic: string
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
