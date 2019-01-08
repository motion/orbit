#!/usr/bin/env node

let devcert = require('devcert')
let httpProxy = require('http-proxy')
let exec = require('execa')
let killPort = require('kill-port')

console.log('starting https proxy server')

async function setupPortForwarding() {
  const getArg = prefix => {
    const arg = process.argv.find(x => x.indexOf(prefix) === 0)
    return arg.replace(prefix, '')
  }
  const [host, port] = getArg('--authUrl=').split(':')
  const proxyPort = getArg('--proxyTo=')

  // kill an existing/stuck server on that port
  try {
    await killPort(port)
  } catch (err) {
    console.log('err killing port', err.message)
  }

  console.log('proxy run on', host, port, proxyPort)

  try {
    console.log('getting certificate...')
    let ssl = await devcert.certificateFor(host)
    httpProxy
      .createServer({
        ssl,
        target: {
          host: 'localhost',
          port: proxyPort,
        },
      })
      .listen(port)
  } catch (err) {
    console.log('certificate fetch error', err)
    return false
  }

  console.log('got certificate')

  const pfEntry = `rdr pass inet proto tcp from any to any port 443 -> ${host} port ${port}`

  // check if we already modified the pfctl
  const pfExisting = (await exec.shell(`pfctl -s nat`)).stdout

  if (pfExisting.indexOf(pfEntry)) {
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
  process.exit(success ? 0 : 1)
}

main()
