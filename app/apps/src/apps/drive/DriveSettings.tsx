import { useModel } from '@o/bridge'
import { AppProps, Table } from '@o/kit'
import { AppBit, AppModel } from '@o/models'
import { CheckboxReactive, View } from '@o/ui'
import { useStore } from '@o/use-store'
import * as React from 'react'
import { SettingManageRow } from '../../views/SettingManageRow'

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
          multiHighlight
          rows={folders.map((file, index) => {
            return {
              key: `${index}`,
              columns: {
                name: {
                  sortValue: file.name,
                  value: file.name,
                },
                active: {
                  sortValue: false,
                  value: <CheckboxReactive isActive={store.onSyncSetter(file.id)} />,
                },
              },
            }
          })}
        />
      </View>
    </>
  )
}
