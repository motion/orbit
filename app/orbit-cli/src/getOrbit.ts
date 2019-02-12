import { CLIOptions, OrbitCLI } from './OrbitCLI'

export async function getOrbit({ config = {}, directory = process.cwd() }: CLIOptions = {}) {
  return new OrbitCLI({ config, directory })
}
