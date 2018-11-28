#!/usr/bin/env node

let devcert = require('devcert')
let httpProxy = require('http-proxy')
let exec = require('execa')
let killPort = require('kill-port')

console.log('starting https proxy server')

async function main() {
  const getArg = prefix => {
    const arg = process.argv.find(x => x.indexOf(prefix) === 0)
    return arg.replace(prefix, '')
  }
  const [host, port] = getArg('--authUrl=').split(':')
  const proxyPort = getArg('--proxyPort=')

  // kill an existing/stuck server on that port
  try {
    await killPort(port)
  } catch (err) {
    console.log('err killing port', err.message)
  }

  console.log('proxy run on', host, port, proxyPort)

  try {
    console.log('getting certificate')
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
    console.log('https error', err)
  }

  // we have to use this style of port forwarding because all the node solutions seem to fail
  // when trying to forward 443
  try {
    const res = await exec.shell(`echo "
rdr pass inet proto tcp from any to any port 443 -> ${host} port ${port}
  " | sudo pfctl -ef -`)
    console.log('res', res.code, res.failed, res.stdout.toString())
  } catch (err) {
    // fine, its already there!
    if (err.message && err.message.indexOf('pf already enabled')) {
      return
    }
    console.log('port forward err', err)
  }
}

main()
