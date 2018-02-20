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
const CHILD_ARGS = ['--inspect=9001', '--remote-debugging-port=9002', ENTRY]
const ENV = {
  NODE_ENV: 'development',
  DEBUG: 'server,server:*',
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
