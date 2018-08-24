import { logger } from '@mcro/logger'
import { Bit, GDriveBitData, GDrivePersonData } from '@mcro/models'
import { getRepository } from 'typeorm'
import { BitEntity } from '../../entities/BitEntity'
import { PersonEntity } from '../../entities/PersonEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import * as Helpers from '../../helpers'
import { createOrUpdate } from '../../helpers/createOrUpdate'
import { createOrUpdatePersonBits } from '../../repository'
import { assign } from '../../utils'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { GDriveLoader } from './GDriveLoader'
import { GDriveLoadedFile, GDriveLoadedUser } from './GDriveTypes'

const log = logger('syncer:gdrive')

export class GDriveSyncer implements IntegrationSyncer {
  private loader: GDriveLoader
  private setting: SettingEntity

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.loader = new GDriveLoader(this.setting)
  }

  async run(): Promise<void> {
    log('synchronizing google drive files')
    await this.loader.load()

    // create entities for loaded files
    const createdFiles = await Promise.all(
      this.loader.files.map(file => {
        return this.createFile(file)
      }),
    )
    const newlyCreatedFiles = createdFiles.filter(file => !!file)
    log(`synced ${newlyCreatedFiles.length} files`)

    // create entities for loaded users
    const createdPeople = await Promise.all(
      this.loader.users.map(user => {
        return this.createPerson(user)
      }),
    )
    const newlyCreatedPeople = createdPeople.filter(person => !!person)
    log(`synced ${newlyCreatedPeople.length} people`)
  }

  private async createFile(file: GDriveLoadedFile): Promise<Bit | null> {
    const data: GDriveBitData = {}
    const id = `gdrive-${this.setting.id}-${file.file.id}`
    let bit = await getRepository(BitEntity).findOne(id)
    if (!bit) bit = new BitEntity()

    assign(bit, {
      integration: 'gdrive',
      setting: this.setting,
      id: file.file.id,
      type: 'document',
      title: file.file.name,
      body: file.content || 'empty',
      data,
      raw: file,
      webLink: file.file.webViewLink
        ? file.file.webViewLink
        : file.file.webContentLink,
      location: file.parent
        ? {
            id: file.parent.id,
            name: file.parent.name,
            webLink: file.file.webViewLink || file.parent.webContentLink,
            desktopLink: ''
          }
        : undefined,
      bitCreatedAt: new Date(file.file.createdTime).getTime(),
      bitUpdatedAt: new Date(file.file.modifiedTime).getTime(),
      // image:
      //   file.file.fileExtension && file.file.thumbnailLink
      //     ? file.file.id + '.' + file.file.fileExtension
      //     : undefined,
    })

    return getRepository(BitEntity).save(bit)
  }

  private async createPerson(user: GDriveLoadedUser) {
    const id = `gdrive-${this.setting.id}-${user.email}`
    const data: GDrivePersonData = {}
    const personEntity = await createOrUpdate(
      PersonEntity,
      {
        id,
        setting: this.setting,
        integrationId: user.email,
        integration: 'gdrive',
        name: user.name,
        email: user.email,
        photo: user.photo,
        data,
        raw: user,
      },
      { matching: ['id', 'integration'] },
    )

    if (user.email)
      await createOrUpdatePersonBits(personEntity)

    return personEntity
  }
}
