import { trackCli, trackError } from '@o/telemetry'
import { execSync } from 'child_process'
import execa from 'execa'
import fs, { pathExistsSync, remove } from 'fs-extra'
import hostedGitInfo from 'hosted-git-info'
import isValid from 'is-valid-path'
import sysPath, { join } from 'path'
import url from 'url'

import { reporter } from './reporter'
import { configStore, promptPackageManager } from './util/configStore'
import { isTty } from './util/isTty'

export type CommandNewOptions = {
  projectRoot: string
  name: string
  template: string
}

/**
 * Main function that clones or copies the template.
 */
export async function commandNew(options: CommandNewOptions) {
  const projectRoot = options.projectRoot || process.cwd()

  const urlObject = url.parse(projectRoot)
  if (urlObject.protocol && urlObject.host) {
    trackError(`NEW_PROJECT_NAME_MISSING`)
    reporter.panic(
      `It looks like you forgot to add a name for your new project. Try running instead "orbit new new-orbit-project ${projectRoot}"`,
    )
    return
  }

  if (!isValid(projectRoot)) {
    reporter.panic(
      `Could not create a project in "${sysPath.resolve(
        projectRoot,
      )}" because it's not a valid path`,
    )
    return
  }

  if (pathExistsSync(sysPath.join(projectRoot, `package.json`))) {
    trackError(`NEW_PROJECT_IS_NPM_PROJECT`)
    reporter.panic(`Directory ${projectRoot} is already an npm project`)
    return
  }

  const hostedInfo = hostedGitInfo.fromUrl(options.template)

  trackCli(`NEW_PROJECT`, { templateName: options.template })

  if (hostedInfo) {
    reporter.info(`Cloning from git ${JSON.stringify(hostedInfo)}`)
    await clone(hostedInfo, projectRoot)
    return
  }

  const templatePath = join(__dirname, '..', 'templates', options.template)

  if (!pathExistsSync(templatePath)) {
    reporter.panic(`Couldn't find local template with name ${options.template} at ${templatePath}`)
    return
  }

  try {
    await copy(templatePath, projectRoot)
  } catch (err) {
    try {
      await remove(projectRoot)
    } catch {}
    reporter.panic(`Error copying template ${err.message}`)
  }
}

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
      if (isTty()) {
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
const gitInit = async projectRoot => {
  reporter.info(`Initialising git in ${projectRoot}`)

  return await spawn(`git init`, { cwd: projectRoot })
}

// Create a .gitignore file if it is missing in the new directory
const maybeCreateGitIgnore = async projectRoot => {
  if (pathExistsSync(sysPath.join(projectRoot, `.gitignore`))) {
    return
  }

  reporter.info(`Creating minimal .gitignore in ${projectRoot}`)
  await fs.writeFile(sysPath.join(projectRoot, `.gitignore`), `.cache\nnode_modules\npublic\n`)
}

// Create an initial git commit in the new directory
const createInitialGitCommit = async (projectRoot, templateUrl) => {
  reporter.info(`Create initial git commit in ${projectRoot}`)

  await spawn(`git add -A`, { cwd: projectRoot })
  // use execSync instead of spawn to handle git clients using
  // pgp signatures (with password)
  execSync(`git commit -m "Initial commit from orbit: (${templateUrl})"`, {
    cwd: projectRoot,
  })
}

// Executes `npm install` or `yarn install` in projectRoot.
const install = async projectRoot => {
  const prevDir = process.cwd()

  reporter.info(`Installing packages...`)
  process.chdir(projectRoot)

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

// Copy template from file system.
const copy = async (templatePath: string, projectRoot: string) => {
  // Chmod with 755.
  // 493 = parseInt('755', 8)
  // @ts-ignore
  await fs.ensureDir(projectRoot, { mode: 493 })

  if (!pathExistsSync(templatePath)) {
    throw new Error(`template doesn't exist at: ${templatePath}`)
  }

  if (templatePath === `.`) {
    throw new Error(
      `You can't create a template from the existing directory. If you want to
      create a new site in the current directory, the trailing dot isn't
      necessary. If you want to create a new site from a local template, run
      something like "orbit new new-orbit-site ../my-orbit-template"`,
    )
  }

  reporter.info(`Creating new site from local template: ${templatePath}`)

  reporter.log(`Copying local template to ${projectRoot} ...`)

  await fs.copy(templatePath, projectRoot, { filter: ignored })

  reporter.success(`Created template directory layout`)

  await install(projectRoot)

  return true
}

// Clones template from URI.
const clone = async (hostInfo: any, projectRoot: string) => {
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

  await spawn(`git clone ${branch} ${url} ${projectRoot} --single-branch`)

  reporter.success(`Created template directory layout`)

  await fs.remove(sysPath.join(projectRoot, `.git`))

  await install(projectRoot)
  await gitInit(projectRoot)
  await maybeCreateGitIgnore(projectRoot)
  await createInitialGitCommit(projectRoot, url)
}
