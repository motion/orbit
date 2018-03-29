import Syncer from '../syncer'
// import * as Constants from '~/constants'
import { Bit } from '@mcro/models'
import { createInChunks } from '~/sync/helpers'
import Path from 'path'
import Fs from 'fs-extra'
import readDir from 'recursive-readdir'
import Yaml from 'js-yaml'

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
    console.log('run folder sync', this.folders)
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
    const title = Path.basename(path)
    const extension = Path.extname(path)
    if (extension !== '.yaml') {
      console.log('ignore non-yaml')
      return
    }
    const fileStats = await Fs.stat(path)
    if (
      await Bit.findOne({
        identifier: path,
        bitUpdatedAt: fileStats.mtime.toString(),
      })
    ) {
      return
    }
    const yamlData = Yaml.safeLoad(await Fs.readFile(path, 'utf8'))
    const bitCreatedAt = fileStats.ctime.toString()
    const bitUpdatedAt = fileStats.mtime.toString()
    const bit = new Bit()
    Object.assign(bit, {
      identifier: path,
      integration: 'folder',
      type: 'file',
      title,
      body: 'none',
      ...yamlData,
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
