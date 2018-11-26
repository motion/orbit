import { getGlobalConfig } from '@mcro/config'
import Sudoer from '@mcro/electron-sudo'
import { SudoerDarwin } from '@mcro/electron-sudo/_/sudoer'
import { execSync, ExecSyncOptions } from 'child_process'
import path from 'path'
import sudoPrompt from 'sudo-prompt'
import tmp from 'tmp'

import { configPath } from './constants'

// const debug = createDebug('devcert:util');
// const debug = console.log.bind(console)
const Config = getGlobalConfig()
const sudoer = new Sudoer({ name: 'Orbit Private Proxy' })
console.log('Electron binary path:', Config.paths.nodeBinary)
// let cmd: any;
// sudoer.spawn(
//   Config.paths.nodeBinary,
//   `${pathToOrbitProxy} --host ${host}:${port} --host go:${port} --host hi:${port} --host orbit:${port}`.split(
//     ' ',
//   ),
//   {
//     env: {
//       ...process.env,
//       ELECTRON_RUN_AS_NODE: 1,
//     },
//   },
// ).then(newCmd => cmd = newCmd)
//
// cmd.stdout.on('data', x => {
//   log.info(`OrbitProxy: ${x}`)
//   if (x.indexOf('OrbitSuccess') > -1) {
//     Desktop.sendMessage(App, App.messages.FORWARD_STATUS, 'success')
//   }
// })
// cmd.stderr.on('data', x => {
//   log.info(`OrbitProxyErr: ${x}`)
//   Desktop.sendMessage(App, App.messages.FORWARD_STATUS, x)
// })

export function openssl(cmd: string): Promise<Buffer> {
  return run(`openssl ${ cmd }`, {
    stdio: 'pipe',
    env: Object.assign({
      RANDFILE: path.join(configPath('.rnd'))
    }, process.env)
  });
}

export async function run(cmd: string, options: ExecSyncOptions & { sudo?: boolean } = {}): Promise<Buffer> {
  // debug(`exec: \`${ cmd }\``);
  let sudo = cmd.trim().substr(0, 4) === 'sudo'

  try {
    if (sudo || options.sudo) {
      cmd = sudo ? cmd.substr(4).trim() : cmd
      console.log(`executing sudo command`, cmd)
      const result = await (sudoer as SudoerDarwin).exec(cmd, options as any)
      if (result.stderr)
        throw new Error(result.stderr)

      console.log(`executed command result`, result)
      return Buffer.from(result.stdout, 'utf8');
    } else {
      console.log(`executing command`, cmd)
      const result = execSync(cmd, options);
      console.log(`executed command result`, result)
      return result
    }

  } catch (err) {
    console.error(`error executing command`, err)
    throw err
  }
}

export function waitForUser() {
  return new Promise((resolve) => {
    process.stdin.resume();
    process.stdin.on('data', resolve);
  });
}

export function reportableError(message: string) {
  return new Error(`${message} | This is a bug in devcert, please report the issue at https://github.com/davewasmer/devcert/issues`);
}

export function mktmp() {
  // discardDescriptor because windows complains the file is in use if we create a tmp file
  // and then shell out to a process that tries to use it
  return tmp.fileSync({ discardDescriptor: true }).name;
}

export function sudo(cmd: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    sudoPrompt.exec(cmd, { name: 'devcert' }, (err: Error | null, stdout: string | null, stderr: string | null) => {
      let error = err || (typeof stderr === 'string' && stderr.trim().length > 0 && new Error(stderr)) ;
      error ? reject(error) : resolve(stdout);
    });
  });
}
