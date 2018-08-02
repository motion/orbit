import { Bit, Setting } from '@mcro/models'
import { BitEntity } from '~/entities/BitEntity'
import { PersonEntity } from '~/entities/PersonEntity'
import * as Helpers from '~/helpers'
import { createOrUpdate } from '~/helpers/createOrUpdate'
import { createOrUpdateBit } from '~/helpers/createOrUpdateBit'
import { createOrUpdatePersonBit } from '~/repository'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { GDriveLoader } from './GDriveLoader'
import { GDriveLoadedFile, GDriveLoadedUser } from './GDriveTypes'

export class GDriveSyncer implements IntegrationSyncer {

  private loader: GDriveLoader
  private setting: Setting

  constructor(setting) {
    this.setting = setting
    this.loader = new GDriveLoader(this.setting)
  }

  async run(): Promise<void> {
    try {
      console.log('synchronizing google drive files')
      await this.loader.load()

      // create entities for loaded files
      const createdFiles = await Promise.all(this.loader.files.map(file => {
        return this.createFile(file)
      }))
      const newlyCreatedFiles = createdFiles.filter(file => !!file)
      console.log(`synced ${newlyCreatedFiles.length} files`)

      // create entities for loaded users
      const createdPeople = await Promise.all(this.loader.users.map(user => {
        return this.createPerson(user)
      }))
      const newlyCreatedPeople = createdPeople.filter(person => !!person)
      console.log(`synced ${newlyCreatedPeople.length} people`)

    } catch (err) {
      console.log('error in google drive sync', err.message, err.stack)
    }
  }

  private createFile(file: GDriveLoadedFile): Promise<Bit|null> {
    return createOrUpdateBit(BitEntity, {
      integration: 'gdocs',
      identifier: file.file.id,
      type: 'document',
      title: file.file.name,
      body: file.content || 'empty',
      data: {
        ...file.file,
        // storing too much for now just to have flexibility
        // htmlBody: html || '',
        // markdownBody: html ? htmlToMarkdown(html) : text || '',
        // textBody: text || '',
      },
      webLink: file.file.webViewLink ? file.file.webViewLink : file.file.webContentLink,
      location: file.parent ? {
        id: file.parent.id,
        name: file.parent.name,
        webLink: file.file.webViewLink || file.parent.webContentLink
      } : undefined,
      bitCreatedAt: new Date(file.file.createdTime).getTime(),
      bitUpdatedAt: new Date(file.file.modifiedTime).getTime(),
      image: file.file.fileExtension && file.file.thumbnailLink ? file.file.id + '.' + file.file.fileExtension : undefined
    })
  }

  private async createPerson(user: GDriveLoadedUser) {
    const person = {
      location: '',
      bio: '',
      avatar: user.photo || '',
      emails: user.email ? [user.email] : [],
    }
    const identifier = `gdrive-${Helpers.hash(person)}`
    const personEntity = await createOrUpdate(
      PersonEntity,
      {
        identifier,
        integrationId: user.email,
        integration: 'gdrive',
        name: user.name,
        data: {
          ...user
        },
      },
      { matching: ['identifier', 'integration'] },
    )

    if (user.email) {
      await createOrUpdatePersonBit({
        email: user.email,
        name: user.name,
        photo: user.photo,
        identifier,
        integration: "gdrive",
        person: personEntity,
      })
    }

    return personEntity
  }

}
