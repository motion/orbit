
export type GoogleDriveFileResponse = {
  nextPageToken: string
  files: {
    name: string
    html?: string
    text?: string
    id: string
    spaces?: [string]
    parents?: [string]
    createdTime: string
    modifiedTime: string
  }[]
}

export type GoogleDriveFile = GoogleDriveFileResponse["files"][0]