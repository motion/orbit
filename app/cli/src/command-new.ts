import { trackCli, trackError } from '@o/telemetry'
import { execSync } from 'child_process'
import execa from 'execa'
import existsSync from 'fs-exists-cached'
import fs from 'fs-extra'
import hostedGitInfo from 'hosted-git-info'
import isValid from 'is-valid-path'
import sysPath from 'path'
import url from 'url'

import { reporter } from './reporter'
import { configStore, promptPackageManager } from './util/configStore'

export type CommandNewOptions = {
  starter: string
  rootPath?: string
}

/**
 * Main function that clones or copies the starter.
 */
export async function commandNew(options: CommandNewOptions) {
  const rootPath = options.rootPath || process.cwd()

  const urlObject = url.parse(rootPath)
  if (urlObject.protocol && urlObject.host) {
    trackError(`NEW_PROJECT_NAME_MISSING`)
    reporter.panic(
      `It looks like you forgot to add a name for your new project. Try running instead "orbit new new-orbit-project ${rootPath}"`,
    )
    return
  }

  if (!isValid(rootPath)) {
    reporter.panic(
      `Could not create a project in "${sysPath.resolve(rootPath)}" because it's not a valid path`,
    )
    return
  }

  if (existsSync(sysPath.join(rootPath, `package.json`))) {
    trackError(`NEW_PROJECT_IS_NPM_PROJECT`)
    reporter.panic(`Directory ${rootPath} is already an npm project`)
    return
  }

  const hostedInfo = hostedGitInfo.fromUrl(options.starter)

  trackCli(`NEW_PROJECT`, { starterName: options.starter })
  if (hostedInfo) await clone(hostedInfo, rootPath)
  else await copy(options.starter, rootPath)
}

const isTTY = require(`./util/is-tty`)
const spawn = (cmd: string, options?: any) => {
  const [file, ...args] = cmd.split(/\s+/)
  return execa(file, args, { stdio: `inherit`, ...options })
}

// Checks the existence of yarn package and user preference if it exists
// We use yarnpkg instead of yarn to avoid conflict with Hadoop yarn
// Refer to https://github.com/yarnpkg/yarn/issues/673
const shouldUseYarn = async () => {
  try {
    execSync(`yarnpkg --version`, { stdio: `ignore` })

    let packageManager = configStore.packageManager.get()
    if (!packageManager) {
      // if package manager is not set:
      //  - prompt user to pick package manager if in interactive console
      //  - default to yarn if not in interactive console
      if (isTTY()) {
        packageManager = (await promptPackageManager()) || `yarn`
      } else {
        packageManager = `yarn`
      }
    }

    return packageManager === `yarn`
  } catch (e) {
    return false
  }
}

// Initialize newly cloned directory as a git repo
const gitInit = async rootPath => {
  reporter.info(`Initialising git in ${rootPath}`)

  return await spawn(`git init`, { cwd: rootPath })
}

// Create a .gitignore file if it is missing in the new directory
const maybeCreateGitIgnore = async rootPath => {
  if (existsSync.syn(sysPath.join(rootPath, `.gitignore`))) {
    return
  }

  reporter.info(`Creating minimal .gitignore in ${rootPath}`)
  await fs.writeFile(sysPath.join(rootPath, `.gitignore`), `.cache\nnode_modules\npublic\n`)
}

// Create an initial git commit in the new directory
const createInitialGitCommit = async (rootPath, starterUrl) => {
  reporter.info(`Create initial git commit in ${rootPath}`)

  await spawn(`git add -A`, { cwd: rootPath })
  // use execSync instead of spawn to handle git clients using
  // pgp signatures (with password)
  execSync(`git commit -m "Initial commit from orbit: (${starterUrl})"`, {
    cwd: rootPath,
  })
}

// Executes `npm install` or `yarn install` in rootPath.
const install = async rootPath => {
  const prevDir = process.cwd()

  reporter.info(`Installing packages...`)
  process.chdir(rootPath)

  try {
    if (await shouldUseYarn()) {
      await fs.remove(`package-lock.json`)
      await spawn(`yarnpkg`)
    } else {
      await fs.remove(`yarn.lock`)
      await spawn(`npm install`)
    }
  } finally {
    process.chdir(prevDir)
  }
}

const ignored = path => !/^\.(git|hg)$/.test(sysPath.basename(path))

// Copy starter from file system.
const copy = async (starterPath: string, rootPath: string) => {
  // Chmod with 755.
  // 493 = parseInt('755', 8)
  // @ts-ignore
  await fs.ensureDir(rootPath, { mode: 493 })

  if (!existsSync(starterPath)) {
    throw new Error(`starter ${starterPath} doesn't exist`)
  }

  if (starterPath === `.`) {
    throw new Error(
      `You can't create a starter from the existing directory. If you want to
      create a new site in the current directory, the trailing dot isn't
      necessary. If you want to create a new site from a local starter, run
      something like "orbit new new-orbit-site ../my-orbit-starter"`,
    )
  }

  reporter.info(`Creating new site from local starter: ${starterPath}`)

  reporter.log(`Copying local starter to ${rootPath} ...`)

  await fs.copy(starterPath, rootPath, { filter: ignored })

  reporter.success(`Created starter directory layout`)

  await install(rootPath)

  return true
}

// Clones starter from URI.
const clone = async (hostInfo: any, rootPath: string) => {
  let url
  // Let people use private repos accessed over SSH.
  if (hostInfo.getDefaultRepresentation() === `sshurl`) {
    url = hostInfo.ssh({ noCommittish: true })
    // Otherwise default to normal git syntax.
  } else {
    url = hostInfo.https({ noCommittish: true, noGitPlus: true })
  }

  const branch = hostInfo.committish ? `-b ${hostInfo.committish}` : ``

  reporter.info(`Creating new site from git: ${url}`)

  await spawn(`git clone ${branch} ${url} ${rootPath} --single-branch`)

  reporter.success(`Created starter directory layout`)

  await fs.remove(sysPath.join(rootPath, `.git`))

  await install(rootPath)
  await gitInit(rootPath)
  await maybeCreateGitIgnore(rootPath)
  await createInitialGitCommit(rootPath, url)
}
