#!/bin/node

import Path from 'path'
import rm from 'rimraf'
import electronPackager from 'electron-packager'
import debug from 'debug'

const log = {
  bundle: debug('electron-build:bundle'),
  ignore: debug('electron-build:ignore'),
  copy: debug('electron-build:copy'),
}

const ROOT = Path.join(__dirname, '..')
const ELECTRON_DIR = Path.join(ROOT, '..', 'electron')
const ignorePaths = [
  // this avoids duplicating the chromium build,
  // since it derefs the subling Versions/Current symlink it still copies
  'Framework.framework/Versions/A',
  // theres a weird nesting here that gets copied too
  // and chromium doesnt complain if we just leave it out
  'Chromium Framework.framework/Versions',
  'Electron Framework.framework/Versions',
  '/node_modules/.bin/',
  '/node_modules/.cache/',
  'node_modules/electron/',
  'node_modules/electron-prebuilt/',
  'node_modules/electron-prebuilt-compile/',
  'node_modules/electron-packager/',
  '/.git/',
]

async function bundle() {
  console.log('bundling', ELECTRON_DIR)
  console.log('remove old app')
  await new Promise(resolve =>
    rm(Path.join(ROOT, 'app', 'Orbit-darwin-x64'), resolve)
  )
  await new Promise(resolve => rm(Path.join(ROOT, 'app', 'Orbit.dmg'), resolve))
  console.log('bundle new app')
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
      if (ignorePaths.find(ignore => path.indexOf(ignore) >= 0)) {
        log.ignore(`ignoring path: ${path}`)
        return true
      }
      // log.bundle(`bundling path: ${path}`)
      return false
    },
  })
  console.log('wrote app to', paths)
}

bundle()
