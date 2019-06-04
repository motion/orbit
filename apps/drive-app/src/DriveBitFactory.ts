import { Bit } from '@o/kit'
import { WorkerUtilsInstance } from '@o/worker-kit'

import { DriveLoadedFile, DriveUser } from './DriveModels'

/**
 * Creates bits out of drive models.
 */
export class DriveBitFactory {
  constructor(private utils: WorkerUtilsInstance) {}

  /**
   * Creates person entity from a given Drive user.
   */
  createPersonBit(user: DriveUser): Bit {
    return this.utils.createBit({
      type: 'person',
      originalId: user.emailAddress,
      title: user.displayName,
      email: user.emailAddress,
      photo: user.photoLink,
    })
  }

  /**
   * Builds a document bit from the given google drive aggregated file.
   */
  createDocumentBit(file: DriveLoadedFile): Bit {
    return this.utils.createBit({
      type: 'document',
      originalId: file.file.id,
      title: file.file.name,
      body: file.content || 'empty',
      data: {},
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
    })
  }
}
