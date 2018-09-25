import { BitEntity, PersonEntity, SettingEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { BitUtils, PersonUtils } from '@mcro/model-utils'
import { GDriveBitData, GDrivePersonData } from '@mcro/models'
import { DriveLoadedFile, DriveLoadedUser, DriveLoader } from '@mcro/services'
import { assign, hash } from '@mcro/utils'
import { getRepository } from 'typeorm'
import { IntegrationSyncer } from '../../core/IntegrationSyncer'
import { createOrUpdatePersonBits } from '../../utils/repository'

const log = new Logger('syncer:gdrive')

/**
 * Syncs Google Drive files.
 */
export class GDriveSyncer implements IntegrationSyncer {
  private loader: DriveLoader
  private setting: SettingEntity
  private people: PersonEntity[]
  private bits: BitEntity[]

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.loader = new DriveLoader(this.setting)
  }

  /**
   * Runs synchronization process.
   */
  async run(): Promise<void> {
    // load all database bits
    log.verbose('loading database bits')
    this.bits = await getRepository(BitEntity).find({
      settingId: this.setting.id,
    })
    log.verbose('database bits were loaded', this.bits)

    // load all database people
    log.verbose('loading database people')
    this.people = await getRepository(PersonEntity).find({
      settingId: this.setting.id,
    })
    log.verbose('database people were loaded', this.people)

    // now load gdrive files from gdrive API
    await this.loader.load()

    // build bits and people from loaded files
    const bits = this.loader.files.map(file => this.buildBit(file))
    const people = this.loader.users.map(user => this.buildPerson(user))

    // saving built bits
    log.verbose('saving bits', bits)
    await getRepository(BitEntity).save(bits)
    log.verbose('bits where saved')

    // saving built bits and people
    log.info('saving bits and people', bits, people)
    await getRepository(PersonEntity).save(people)
    await createOrUpdatePersonBits(people)
    await getRepository(BitEntity).save(bits)
    log.verbose('bits and people where saved')
  }

  /**
   * Builds a bit from the given gdrive aggregated file.
   */
  private buildBit(file: DriveLoadedFile): BitEntity {
    const data: GDriveBitData = {}
    const id = hash(`gdrive-${this.setting.id}-${file.file.id}`)
    const bit = this.bits.find(bit => bit.id === id)

    return assign(
      bit || new BitEntity(),
      BitUtils.create({
        integration: 'gdrive',
        setting: this.setting,
        id,
        type: 'document',
        title: file.file.name,
        body: file.content || 'empty',
        data,
        raw: file,
        webLink: file.file.webViewLink ? file.file.webViewLink : file.file.webContentLink,
        location: file.parent
          ? {
              id: file.parent.id,
              name: file.parent.name,
              webLink: file.file.webViewLink || file.parent.webContentLink,
              desktopLink: '',
            }
          : undefined,
        bitCreatedAt: new Date(file.file.createdTime).getTime(),
        bitUpdatedAt: new Date(file.file.modifiedTime).getTime(),
        // image:
        //   file.file.fileExtension && file.file.thumbnailLink
        //     ? file.file.id + '.' + file.file.fileExtension
        //     : undefined,
      }),
    )
  }

  /**
   * Creates person entity from a given google drive user.
   */
  private buildPerson(user: DriveLoadedUser): PersonEntity {
    const id = hash(`gdrive-${this.setting.id}-${user.email}`)
    const data: GDrivePersonData = {}
    const person = this.people.find(person => person.id === id)

    return Object.assign(
      person || new PersonEntity(),
      PersonUtils.create({
        id,
        setting: this.setting,
        integrationId: user.email,
        integration: 'gdrive',
        name: user.name,
        email: user.email,
        photo: user.photo,
        data,
        raw: user,
      }),
    )
  }
}
