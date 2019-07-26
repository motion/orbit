import commandExists from 'command-exists'
import exec from 'execa'

export async function npmCommand(args: string) {
  const cmd = await yarnOrNpm()
  await exec(cmd, args.split(' '))
}

export async function yarnOrNpm() {
  const hasYarn = await commandExists('yarn')
  const hasNpm = await commandExists('npm')
  if (!hasYarn && !hasNpm) {
    throw new Error(`Neither npm or yarn installed, need one of them to continue.`)
  }
  return hasYarn ? 'yarn' : 'npm'
}
