import { BitUtils } from '@mcro/model-utils'
import { Bit, DriveBitData, Setting } from '@mcro/models'
import { DriveLoadedFile } from '@mcro/services'

/**
 * Creates a Drive Bit.
 */
export class DriveBitFactory {
  private setting: Setting

  constructor(setting: Setting) {
    this.setting = setting
  }

  /**
   * Builds a bit from the given google drive aggregated file.
   */
  create(file: DriveLoadedFile): Bit {
    return BitUtils.create({
      integration: 'gdrive',
      setting: this.setting,
      type: 'document',
      title: file.file.name,
      body: file.content || 'empty',
      data: {} as DriveBitData,
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
    }, file.file.id)
  }

}
