#!/usr/bin/env node

import devcert from 'devcert'
import https from 'https'
import exec from 'execa'

console.log('starting https proxy server')

async function main() {
  const getArg = prefix => process.argv[process.argv.indexOf(prefix)].replace(prefix, '')
  const [host, port] = getArg('--proxyUrl=').split(':')
  console.log('proxy run on', host, port)

  try {
    console.log('starting getting')
    let ssl = await devcert.certificateFor('my-app.test')

    https
      .createServer(ssl, (_req, res) => {
        res.writeHead(200)
        res.end('hello world\n')
      })
      .listen(port)

    const res = await exec.shell(`echo "
rdr pass inet proto tcp from any to any port 443 -> ${host} port ${port}
  " | sudo pfctl -ef -`)
    console.log('res', res.code, res.failed, res.stdout.toString())
  } catch (err) {
    console.log('got err', err)
  }
}

main()
