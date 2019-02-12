export type CLIOptions = {
  config?: Object
  directory?: string
}

export class OrbitCLI {
  options: CLIOptions

  constructor(options: CLIOptions) {
    this.options = options
  }

  async initialize() {}

  dispose() {}

  async build(opts: { isDev?: boolean }) {
    console.log('build', opts)
  }

  async watch(opts: { devPort: number; devHost?: string }) {
    console.log('watch', opts)
  }
}
