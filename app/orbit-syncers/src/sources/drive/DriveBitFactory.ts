import { BitUtils } from '@mcro/model-utils'
import { Bit, DriveBitData, DriveSource } from '@mcro/models'
import { DriveLoadedFile } from '@mcro/services'

/**
 * Creates a Drive Bit.
 */
export class DriveBitFactory {
  private source: DriveSource

  constructor(source: DriveSource) {
    this.source = source
  }

  /**
   * Builds a bit from the given google drive aggregated file.
   */
  create(file: DriveLoadedFile): Bit {
    return BitUtils.create(
      {
        integration: 'drive',
        source: this.source,
        spaceId: this.source.spaceId,
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
