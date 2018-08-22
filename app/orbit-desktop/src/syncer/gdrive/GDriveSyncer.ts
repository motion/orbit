import { Bit } from '@mcro/models'
import { logger } from '@mcro/logger'
import { GDriveBitData, GDrivePersonData } from '@mcro/models'
import { BitEntity } from '../../entities/BitEntity'
import { PersonEntity } from '../../entities/PersonEntity'
import * as Helpers from '../../helpers'
import { createOrUpdate } from '../../helpers/createOrUpdate'
import { createOrUpdateBit } from '../../helpers/createOrUpdateBit'
import { createOrUpdatePersonBits } from '../../repository'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { GDriveLoader } from './GDriveLoader'
import { GDriveLoadedFile, GDriveLoadedUser } from './GDriveTypes'
import { SettingEntity } from '../../entities/SettingEntity'

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

  private createFile(file: GDriveLoadedFile): Promise<Bit | null> {
    const data: GDriveBitData = {}
    return createOrUpdateBit(BitEntity, {
      integration: 'gdocs',
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
          }
        : undefined,
      bitCreatedAt: new Date(file.file.createdTime).getTime(),
      bitUpdatedAt: new Date(file.file.modifiedTime).getTime(),
      image:
        file.file.fileExtension && file.file.thumbnailLink
          ? file.file.id + '.' + file.file.fileExtension
          : undefined,
    })
  }

  private async createPerson(user: GDriveLoadedUser) {
    const person = {
      location: '',
      bio: '',
      avatar: user.photo || '',
      emails: user.email ? [user.email] : [],
    }
    const id = `gdrive-${this.setting.id}-${Helpers.hash(person)}`
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
