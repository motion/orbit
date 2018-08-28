#!/bin/node

import Path from 'path'
import rm from 'rimraf'
import electronPackager from 'electron-packager'
import rebuild from 'electron-rebuild'
import debug from 'debug'
import execa from 'execa'
import Fs from 'fs-extra'

const log = {
  bundle: debug('electron-build:bundle'),
  ignore: debug('electron-build:ignore'),
  copy: debug('electron-build:copy'),
}

const ROOT = Path.join(__dirname, '..')
const STAGING_DIR = Path.join(ROOT, 'stage-app')
const BUILD_DIR = Path.join(ROOT, 'dist')

const ignorePaths = [
  // were going to copy in the oracle sub-app ourselves
  'orbit.app',
  // avoid leaking our sources a bit
  '.js.map',
  '.d.ts',
  // avoid some bundle size ⚠️ hopefully dont cause headaches....
  '.gif',
  '/.git/',
]

async function clean() {
  await new Promise(resolve =>
    rm(Path.join(BUILD_DIR, 'Orbit-darwin-x64'), resolve),
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
  await new Promise(resolve =>
    rm(Path.join(ROOT, 'dist', 'Orbit.dmg'), resolve),
  )
}

async function bundle() {
  console.log('cleaning old app...')
  try {
    await clean()
  } catch (err) {
    console.log('error cleaning', err)
  }

  console.log('copying parent version into stage-app...')
  const parentPkg = Path.join(STAGING_DIR, '..', 'package.json')
  const stagePkg = Path.join(STAGING_DIR, 'package.json')
  const { version } = require(parentPkg)
  const pkg = require(stagePkg)
  pkg.version = version
  await Fs.writeFile(stagePkg, JSON.stringify(pkg, null, 2))
  console.log('copied version', version)

  // why install --production and not just dereference symlinks?
  // because it avoids bundling massive things like Oracle build files
  // but requires we use verdaccio

  console.log('packaging new app...')
  const paths = await electronPackager({
    platform: 'darwin',
    // asar: true,
    appBundleId: 'com.o.orbit',
    helperBundleId: 'com.o.orbit',
    dir: STAGING_DIR,
    out: BUILD_DIR,
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
    cwd: Path.join(BUILD_DIR, 'Orbit-darwin-x64'),
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
