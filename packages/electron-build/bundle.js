#!/bin/node

import Path from 'path'
import rm from 'rimraf'
import electronPackager from 'electron-packager'
import rebuild from 'electron-rebuild'
import debug from 'debug'
import execa from 'execa'

const log = {
  bundle: debug('electron-build:bundle'),
  ignore: debug('electron-build:ignore'),
  copy: debug('electron-build:copy'),
}

const ROOT = __dirname
const ELECTRON_DIR = Path.join(ROOT, '..', '..', 'apps', 'electron')
const ignorePaths = [
  // exclude extra dirs for xcode
  'oracle/train',
  'oracle/pyocr',
  'oracle/swindler',
  'oracle/orbit/Carthage',
  'oracle/orbit/Index',
  'oracle/orbit/Build/Intermediates',
  'oracle/orbit/Build/Products/Debug',
  'oracle/orbit/orbit.xcodeproj',
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
    rm(Path.join(ROOT, 'app', 'Orbit-darwin-x64'), resolve),
  )
  await new Promise(resolve =>
    rm(
      Path.join(
        ROOT,
        '..',
        'oracle/orbit/Build/Products/Release/orbit.app/Contents/Resources/Bridge.plugin/Contents/Resources/lib/python3.5/config',
      ),
      resolve,
    ),
  )
  await new Promise(resolve =>
    rm(
      Path.join(
        ROOT,
        '..',
        'oracle/orbit/Build/Products/Release/orbit.app/Contents/Resources/Bridge.plugin/Contents/Resources/lib/python3.5/site.pyc',
      ),
      resolve,
    ),
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
    prune: true,
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
    afterCopy: [
      (buildPath, electronVersion, platform, arch, callback) => {
        console.log('rebuilding for electron...', buildPath, electronVersion)
        rebuild({ buildPath, electronVersion, arch })
          .then(() => callback())
          .catch(error => callback(error))
      },
    ],
  })
  console.log('wrote app to', paths)
  // this is necessary for high sierra to be able to sign
  console.log('removing metadata for signing...')
  await execa('xattr', ['-cr', 'Orbit.app'], {
    cwd: Path.join(ROOT, 'app', 'Orbit-darwin-x64'),
  })
}

bundle()

process.on('uncaughtException', err => {
  console.log('uncaughtException', err.stack)
  process.exit(0)
})
process.on('unhandledRejection', function(reason) {
  console.log(reason)
  process.exit(0)
})
