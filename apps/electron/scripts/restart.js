#!/usr/bin/env node
const electron = require('electron')
const proc = require('child_process')
const watch = require('watch')
const fs = require('fs')
const Path = require('path')

// TODO: give this an interface for entry/watch_dir/env
// TODO: turn this into a nice class

const ROOT = Path.join(__dirname, '..')
const ENTRY = Path.join(ROOT, 'lib', 'start-app')
const WATCH_DIR = Path.join(ROOT, 'lib')
const CHILD_ARGS = ['--inspect=9001', ENTRY]
const ENV = {
  NODE_ENV: 'development',
}

console.log('Starting Electron App', ENTRY)

function parseURL(str) {
  const prefix = 'ws://'
  const devtools =
    'chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws='
  let re = /(\b(ws?|chrome-devtools):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
  let matches = str.match(re)
  let link = matches ? matches[0] : null
  let gotURL = link && link.indexOf(prefix) >= 0
  if (gotURL) {
    const url = `${devtools}${link.replace(prefix, '')}`
    fs.writeFileSync(Path.join(ROOT, 'tmp', 'devurl.txt'), url)
  }
}

// handled by startApp()
let child
let settings

function startApp() {
  settings = fs.existsSync('./.electromonrc')
    ? fs.readFileSync('./.electromonrc', 'utf-8')
    : ''
  const envStr = Object.keys(ENV).reduce((a, c) => `${a} ${c}=${ENV[c]}`, '')
  console.log(`$ ${envStr} electron ${CHILD_ARGS.join(' ')}`)
  child = proc.spawn(electron, CHILD_ARGS, {
    env: ENV,
  })
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
  child.stderr.on('data', parseURL)
  child.on('exit', () => {
    process.exit()
  })
}

startApp()

const readline = require('readline')
const debounceRestart = debounce(restart, 500)

watch.watchTree(WATCH_DIR, { ignoreDotFiles: true }, function(f, curr, prev) {
  if (typeof f == 'object' && prev === null && curr === null) {
    // Finished walking the tree
  } else {
    console.log('saw a change')
    if (settings != '') {
      if (RegExp(settings.replace(/\n/g, '')).test(f) == false) {
        debounceRestart()
      }
    } else {
      debounceRestart()
    }
  }
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.on('line', cmd => {
  if (cmd == 'rs') restart()
})

rl.on('SIGINT', () => {
  console.log('Shutting Down Electron')
  child.stdin.pause()
  child.kill()
  process.exit()
})

function restart() {
  console.log('Restarting')
  child.stdin.pause()
  child.kill()
  startApp()
}

function debounce(func, wait, immediate) {
  var timeout
  return function() {
    var context = this,
      args = arguments
    var later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

// One-liner for current directory, ignores .dotfiles
