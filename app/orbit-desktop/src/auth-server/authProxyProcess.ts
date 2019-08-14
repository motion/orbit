#!/usr/bin/env node

let devcert = require('@o/devcert')
let httpProxy = require('http-proxy')
let exec = require('execa')
let killPort = require('clear-port')
let fs = require('fs')
let path = require('path')

console.log('starting https proxy server')
const silentRm = path => {
  try {
    fs.unlinkSync(path)
    console.log('removed', path)
    return true
  } catch {
    return false
  }
}

const getArg = (prefix: string) => {
  const arg = process.argv.find(x => x.indexOf(prefix) === 0)
  return arg.replace(prefix, '')
}

async function setupPortForwarding() {
  const homeDir = getArg('--homeDir=')
  const [authHost, authPort] = getArg('--authUrl=').split(':')
  const proxyPort = getArg('--proxyTo=')

  // kill an existing/stuck server on that port
  try {
    await killPort(authPort)
  } catch (err) {
    console.log('err killing port', err.message)
  }

  // remove old cert, because it expires quickly https://github.com/davewasmer/devcert/issues/22
  // TODO only mac
  const devCertDir = path.join(homeDir, 'Library', 'Application Support', 'devcert')
  if (fs.existsSync(devCertDir)) {
    silentRm(devCertDir)
  }

  console.log('proxy run on', authHost, 'from', authPort, 'to', proxyPort)

  try {
    console.log('getting certificate...')
    let ssl = await devcert.certificateFor(authHost, {
      skipFirefox: true,
    })
    console.log('got certificate, creating server...', authPort)
    httpProxy
      .createServer({
        ssl,
        target: {
          host: 'localhost',
          port: proxyPort,
        },
      })
      .listen(authPort)
  } catch (err) {
    console.log('certificate fetch error', err)
    return false
  }

  const pfEntry = `rdr pass inet proto tcp from any to any port 443 -> ${authHost} port ${authPort}`

  // check if we already modified the pfctl
  const pfExisting = (await exec.shell(`pfctl -s nat`)).stdout

  if (pfExisting.indexOf(pfEntry) >= 0) {
    console.log('has existing entry for port forwarding, done')
    return true
  }

  console.log('no existing pf entry, creating...')

  // we have to use this style of port forwarding because all the node solutions seem to fail
  // when trying to forward 443
  try {
    const pfCommand = `echo "\n${pfEntry}\n" | sudo pfctl -ef -`
    console.log('running command', pfCommand)
    const res = await exec.shell(pfCommand)
    console.log('created new pf entry...', res.code, res.failed, res.stdout.toString())
  } catch (err) {
    // fine, its already there!
    if (err.message && err.message.indexOf('pf already enabled')) {
      return true
    }
    console.log('port forward err', err)
    return false
  }

  return true
}

async function main() {
  const success = await setupPortForwarding()
  if (!success) {
    process.exit(1)
  } else {
    console.log('SUCCESS! proxying...')
  }
}

main()
