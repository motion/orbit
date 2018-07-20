import { Bit, createOrUpdateBit, Setting, createOrUpdate, Person } from '@mcro/models'
import * as Helpers from '~/helpers'
import { GoogleDriveLoader } from './GoogleDriveLoader'
import { GoogleDriveLoadedFile, GoogleDriveLoadedUser } from './GoogleDriveTypes'

export class GoogleDriveSync {
  loader: GoogleDriveLoader
  setting: Setting

  constructor(setting) {
    this.setting = setting
    this.loader = new GoogleDriveLoader(this.setting)
  }

  async run(): Promise<void> {
    return;
    try {
      console.log('synchronizing google drive files')
      await this.loader.load()

      // create entities for loaded files
      const createdFiles = await Promise.all(this.loader.files.map(file => {
        return this.createFile(file)
      }));
      const newlyCreatedFiles = createdFiles.filter(file => !!file);
      console.log(`synced ${newlyCreatedFiles.length} files`)

      // create entities for loaded users
      const createdPeople = await Promise.all(this.loader.users.map(user => {
        return this.createPerson(user)
      }));
      const newlyCreatedPeople = createdPeople.filter(person => !!person);
      console.log(`synced ${newlyCreatedPeople.length} people`)

    } catch (err) {
      console.log('error in google drive sync', err.message, err.stack)
    }
  }

  private async createFile(file: GoogleDriveLoadedFile): Promise<Bit|null> {
    return await createOrUpdateBit(Bit, {
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
      bitCreatedAt: new Date(file.file.createdTime),
      bitUpdatedAt: new Date(file.file.modifiedTime),
      image: file.file.fileExtension && file.file.thumbnailLink ? file.file.id + "." + file.file.fileExtension : undefined
    })
  }

  private async createPerson(user: GoogleDriveLoadedUser) {
    const person = {
      location: '',
      bio: '',
      avatar: user.photo || '',
      emails: user.email ? [user.email] : [],
    }
    return await createOrUpdate(
      Person,
      {
        identifier: `gdrive-${Helpers.hash(person)}`,
        integrationId: user.email,
        integration: 'gdrive',
        name: user.name,
        data: {
          ...user
        },
      },
      { matching: Person.identifyingKeys },
    )
  }

}
