#!/bin/node

import Path from 'path'
import rm from 'rimraf'
// import Fs from 'fs'
import electronPackager from 'electron-packager'
import debug from 'debug'

const log = {
  bundle: debug('electron-build:bundle'),
  ignore: debug('electron-build:ignore'),
}

const ROOT = Path.join(__dirname, '..')
const ELECTRON_DIR = Path.join(ROOT, '..', 'electron')
const ignoreDirectories = [
  '/src',
  '/node_modules/.bin',
  '/node_modules/.cache',
  '.local-chromium',
]

async function bundle() {
  console.log('bundling', ELECTRON_DIR)

  await new Promise(resolve =>
    rm(Path.join(ROOT, 'app', 'Orbit-darwin-x64'), resolve)
  )

  const paths = await electronPackager({
    dir: ELECTRON_DIR,
    out: Path.join(ROOT, 'app'),
    icon: Path.join(ROOT, 'resources', 'icon.icns'),
    overwrite: true,
    tmpdir: false,
    derefSymlinks: true,
    prune: false,
    packageManager: false,
    ignore: path => {
      // paths are relative to the current dir but weird
      // so "/app/something" is referring to the "orbit/apps/electron/app/something"
      if (ignoreDirectories.find(dir => path.indexOf(dir) >= 0)) {
        log.ignore(`ignoring path: ${path}`)
        return true
      }
      log.bundle(`bundling path: ${path}`)
      return false
    },
  })
  console.log('wrote app to', paths)
}

bundle()
