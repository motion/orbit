import Syncer from '../syncer'
// import * as Constants from '~/constants'
import { Bit } from '@mcro/models'
import { createInChunks } from '~/sync/helpers'
import Path from 'path'
import Fs from 'fs-extra'
import readDir from 'recursive-readdir'

const log = debug('folder')
// const sleep = ms => new Promise(res => setTimeout(res, ms))

class FolderSync {
  constructor(setting, helpers) {
    this.setting = setting
    this.helpers = helpers
  }

  get folders() {
    const defaultPath = Path.join(
      require.resolve('@mcro/examples'),
      '..',
      'test',
    )
    return this.setting.values.folders || [defaultPath]
  }

  run = async () => {
    console.log('run folder sync')
    for (const folder of this.folders) {
      await this.syncFolder(folder)
    }
  }

  async syncFolder(folder) {
    const files = await readDir(folder)
    const results = await createInChunks(files, this.createFile)
    return results
  }

  createFile = async path => {
    const fileStats = await Fs.stat(path)
    if (
      await Bit.findOne({
        integration: 'folder',
        identifier: path,
        bitUpdatedAt: fileStats.mtime,
      })
    ) {
      console.log('found existing', path)
      return
    }
    const fileContents = await Fs.readFile(path)
    const bitCreatedAt = fileStats.ctime
    const bitUpdatedAt = fileStats.mtime
    const bit = new Bit()
    Object.assign(bit, {
      identifier: path,
      integration: 'folder',
      type: 'file',
      title: Path.basename(path),
      body: fileContents.toString(),
      bitCreatedAt,
      bitUpdatedAt,
    })
    await bit.save()
  }
}

export default setting => {
  // const helpers = getHelpers(setting)
  return new Syncer('folder', {
    setting,
    actions: {
      // drive: { every: 60 },
      folder: { every: 60 * 5 }, // 5 minutes
    },
    syncers: {
      folder: new FolderSync(setting),
    },
  })
}
