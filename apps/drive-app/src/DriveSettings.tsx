import { AppBit, AppModel, AppProps, SettingManageRow, Table, useModel, useStore } from '@o/kit'
import { View } from '@o/ui'
import * as React from 'react'

class DriveSettingsStore {
  props: { app?: AppBit }
  popularFolders = []

  async fetchFiles() {
    if (!this.service.fetch) return
    const { files } = await this.service.fetch('/files', {
      query: {
        pageSize: 1000,
        q: 'mimeType="application/vnd.google-apps.folder"',
        orderBy: [
          'sharedWithMeTime desc',
          'viewedByMeTime desc',
          'modifiedByMeTime desc',
          'modifiedTime desc',
        ],
      },
    })
    this.popularFolders = files
  }

  onSyncSetter = id => () => {
    console.log('should set', id)
    return false
  }

  get service(): any {
    // todo: broken by umed please fix me
    // !TODO this should come from first class api for fetching from apps
    console.warn('todo: broken by umed please fix me')
    return {}
  }
}

export function DriveSettings({ subId }: AppProps) {
  const [app] = useModel<AppBit, any>(AppModel as any, { where: { id: +subId } })
  const store = useStore(DriveSettingsStore, { app })
  const folders = store.popularFolders

  return (
    <>
      <SettingManageRow app={app} whitelist={null} />
      <View flex={1} opacity={1}>
        <Table
          columns={{
            name: {
              value: 'Folder Name',
            },
            active: {
              value: 'Active',
            },
          }}
          multiselect
          rows={folders.map((file, index) => {
            return {
              key: `${index}`,
              values: {
                name: file.name,
                active: false,
              },
            }
          })}
        />
      </View>
    </>
  )
}
