import { configStore } from '@o/config'
import { CommandOpts } from '@o/mediator'
import { AppCreateNewCommand, AppCreateNewOptions, StatusReply } from '@o/models'
import { trackCli, trackError } from '@o/telemetry'
import { execSync } from 'child_process'
import execa from 'execa'
import fs, { pathExists, pathExistsSync, readJSON, remove } from 'fs-extra'
import hostedGitInfo from 'hosted-git-info'
import isValid from 'is-valid-path'
import { basename, join, resolve } from 'path'
import prompts from 'prompts'
import replaceInFile from 'replace-in-file'
import { Stream } from 'stream'
import url from 'url'

import { getOrbitDesktop } from './getDesktop'
import { isTty } from './isTty'
import { logStatusReply } from './logStatusReply'
import { reporter } from './reporter'

// adapted from gatsby
// The MIT License (MIT)
// Copyright (c) 2015 Gatsbyjs

let currentCommandOpts: CommandOpts | null = null

/**
 * Main function that clones or copies the template.
 */
export async function commandNew(
  options: AppCreateNewOptions,
  commandOpts?: CommandOpts,
): Promise<StatusReply> {
  currentCommandOpts = commandOpts || null
  reporter.verbose(`commandNew ${!!commandOpts}`)

  try {
    if (await isInWorkspace(options.projectRoot)) {
      // inside orbit workspace, create app in it
      reporter.info(`Creating app ${options.name} in workspace...`)
      const { mediator, orbitProcess } = await getOrbitDesktop({
        singleUseMode: true,
      })
      logStatusReply(
        await mediator.command(AppCreateNewCommand, options, {
          timeout: 60 * 1000 * 10,
          onMessage: reporter.info,
        }),
      )
      orbitProcess && orbitProcess.kill()
      process.exit(0)
    }

    const res = await copyTemplate(options, {
      async preInstall({ path }) {
        await replaceInFile({
          files: join(path, '**'),
          from: ['$ID', '$NAME', '$ICON'],
          to: [options.identifier, options.name, options.icon],
        })
      },
    })

    reporter.verbose(`Finished with commandNew`)

    return res
  } catch (err) {
    reporter.error(err.message, err)
  } finally {
    currentCommandOpts = null
  }
}

function createWritableStream(onMessage: (message: string) => any) {
  const stream = new Stream.Writable()
  stream._write = (chunk, _encoding, next) => {
    onMessage(chunk.toString())
    next()
  }
  return stream
}

function spawnAndLog(cmd: string, options?: any) {
  const [file, ...args] = cmd.split(/\s+/)
  const execed = execa(file, args, options)
  const stdoutStream = createWritableStream(message => {
    if (currentCommandOpts) {
      currentCommandOpts.sendMessage(message)
    }
  })
  execed.stdout.pipe(stdoutStream)
  execed.stdout.pipe(process.stdout)
  return execed
}

export async function copyTemplate(
  options: { name: string; projectRoot?: string; template: string },
  { preInstall }: { preInstall?: (opts: { path: string }) => void },
): Promise<StatusReply> {
  const appRoot = join(options.projectRoot || process.cwd(), options.name)
  const urlObject = url.parse(appRoot)
  if (urlObject.protocol && urlObject.host) {
    trackError(`NEW_PROJECT_NAME_MISSING`)
    return {
      type: 'error',
      message: `It looks like you forgot to add a name for your new project.`,
    }
  }
  if (!isValid(appRoot)) {
    return {
      type: 'error',
      message: `Could not create a project in "${resolve(appRoot)}" because it's not a valid path`,
    }
  }

  if (pathExistsSync(appRoot)) {
    trackError(`NEW_PROJECT_EXISTS`)
    return {
      type: 'error',
      message: `Directory ${appRoot} already exists.`,
    }
  }

  const hostedInfo = hostedGitInfo.fromUrl(options.template)
  trackCli(`NEW_PROJECT`, { templateName: options.template })

  // clone
  try {
    if (hostedInfo) {
      reporter.info(`Cloning from git ${JSON.stringify(hostedInfo)}`)
      await clone(hostedInfo, appRoot)
    } else {
      const templatePath = join(__dirname, '..', 'templates', options.template)
      if (!pathExistsSync(templatePath)) {
        return {
          type: 'error',
          message: `Couldn't find local template with name ${options.template} at ${templatePath}`,
        }
      }
      await copy(templatePath, appRoot)
    }
  } catch (err) {
    return await returnError(appRoot, err)
  }

  // install
  try {
    await preInstall({
      path: appRoot,
    })
    await install(appRoot)

    return {
      type: 'success',
      message: `Created app at ${appRoot}`,
    }
  } catch (err) {
    return await returnError(appRoot, err)
  }
}

async function returnError(appRoot: string, error: any) {
  try {
    await remove(appRoot)
  } catch {}
  return {
    type: 'error',
    message: `Error copying template ${error.message}`,
  } as const
}

export async function isInWorkspace(directory: string) {
  const pkgPath = join(directory, 'package.json')
  if (await pathExists(pkgPath)) {
    const pkg = await readJSON(pkgPath)
    return !!(pkg && pkg.config && pkg.config.orbitWorkspace)
  }
  return false
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

export const promptPackageManager = async () => {
  const promptsAnswer = await prompts([
    {
      type: `select`,
      name: `packageManager`,
      message: `Which package manager would you like to use ?`,
      choices: [{ title: `yarn`, value: `yarn` }, { title: `npm`, value: `npm` }],
      initial: 0,
    },
  ])
  const response = promptsAnswer.packageManager
  if (response) {
    configStore.packageManager.set(response)
  }
  return response
}

// Initialize newly cloned directory as a git repo
const gitInit = async projectRoot => {
  reporter.info(`Initialising git in ${projectRoot}`)

  return await spawnAndLog(`git init`, { cwd: projectRoot })
}

// Create a .gitignore file if it is missing in the new directory
const maybeCreateGitIgnore = async projectRoot => {
  if (pathExistsSync(join(projectRoot, `.gitignore`))) {
    return
  }

  reporter.info(`Creating minimal .gitignore in ${projectRoot}`)
  await fs.writeFile(join(projectRoot, `.gitignore`), `.cache\nnode_modules\npublic\n`)
}

// Create an initial git commit in the new directory
const createInitialGitCommit = async (projectRoot, templateUrl) => {
  reporter.info(`Create initial git commit in ${projectRoot}`)

  await spawnAndLog(`git add -A`, { cwd: projectRoot })
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
      await spawnAndLog(`yarn install`, { cwd: projectRoot })
    } else {
      await spawnAndLog(`npm install`, { cwd: projectRoot })
    }
  } finally {
    process.chdir(prevDir)
  }
}

const ignored = path => !/^\.(git|hg)$/.test(basename(path))

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
      create a new app in the current directory, the trailing dot isn't
      necessary. If you want to create a new app from a local template, run
      something like "orbit new new-orbit-app ../my-orbit-template"`,
    )
  }

  reporter.info(`Creating new app from local template: ${templatePath}`)
  reporter.info(`Copying local template to ${projectRoot} ...`)

  await fs.copy(templatePath, projectRoot, { filter: ignored })

  reporter.success(`Created template directory layout`)

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

  reporter.info(`Creating new app from git: ${url}`)

  await spawnAndLog(`git clone ${branch} ${url} ${projectRoot} --single-branch`)

  reporter.success(`Created template directory layout`)

  await fs.remove(join(projectRoot, `.git`))

  await install(projectRoot)
  await gitInit(projectRoot)
  await maybeCreateGitIgnore(projectRoot)
  await createInitialGitCommit(projectRoot, url)
}
