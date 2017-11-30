#!/bin/node

import Path from 'path'
import rm from 'rimraf'
import Fs from 'fs-extra'
import electronPackager from 'electron-packager'
import debug from 'debug'

const log = {
  bundle: debug('electron-build:bundle'),
  ignore: debug('electron-build:ignore'),
  copy: debug('electron-build:copy'),
}

const ROOT = Path.join(__dirname, '..')
const ELECTRON_DIR = Path.join(ROOT, '..', 'electron')
const ignoreDirectories = [
  '/node_modules/.bin',
  '/node_modules/.cache',
  '.local-chromium',
]

const copyAfter = [
  [
    Path.join(
      ROOT,
      '..',
      'crawler',
      'node_modules',
      'puppeteer',
      '.local-chromium'
    ),
    Path.join(
      ROOT,
      'app',
      'Orbit-darwin-x64',
      'Orbit.app',
      'Contents',
      'Resources',
      'app',
      'node_modules',
      '@mcro',
      'api',
      'node_modules',
      '@mcro',
      'crawler',
      'node_modules',
      'puppeteer',
      '.local-chromium'
    ),
  ],
]

async function bundle() {
  console.log('bundling', ELECTRON_DIR)
  console.log('remove old app')
  await new Promise(resolve =>
    rm(Path.join(ROOT, 'app', 'Orbit-darwin-x64'), resolve)
  )
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
      if (ignoreDirectories.find(dir => path.indexOf(dir) >= 0)) {
        log.ignore(`ignoring path: ${path}`)
        return true
      }
      log.bundle(`bundling path: ${path}`)
      return false
    },
  })
  for (const [src, out] of copyAfter) {
    log.copy(`copy\n from: ${src}\n   to: ${out}`)
    await Fs.copy(src, out)
  }
  console.log('wrote app to', paths)
}

bundle()
