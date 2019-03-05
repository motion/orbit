import { AppBit, Bit } from '@mcro/models'
import { createBit } from '@mcro/sync-kit'
import { DriveLoadedFile, DriveUser } from './DriveTypes'
import { DriveBitData } from './DriveBitData'

/**
 * Creates bits out of drive models.
 */
export class DriveBitFactory {

  constructor(private app: AppBit) {
  }

  /**
   * Creates person entity from a given Drive user.
   */
  createPersonBit(user: DriveUser): Bit {
    return createBit(
      {
        appIdentifier: 'drive',
        appId: this.app.id,
        type: 'person',
        originalId: user.emailAddress,
        title: user.displayName,
        email: user.emailAddress,
        photo: user.photoLink,
      },
      user.emailAddress,
    )
  }

  /**
   * Builds a document bit from the given google drive aggregated file.
   */
  createDocumentBit(file: DriveLoadedFile): Bit {
    return createBit(
      {
        appIdentifier: 'drive',
        appId: this.app.id,
        type: 'document',
        title: file.file.name,
        body: file.content || 'empty',
        data: {} as DriveBitData,
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
      },
      file.file.id,
    )
  }


}
