import * as React from 'react'
import { ReactiveCheckBox } from '../../../../views/ReactiveCheckBox'
import { Text, SearchableTable, View } from '@mcro/ui'
import { DriveSource } from '@mcro/models'
import { OrbitSourceSettingProps } from '../../../types'
import { SettingManageRow } from '../../../views/settings/SettingManageRow'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'

type Props = OrbitSourceSettingProps<DriveSource>

class DriveSettingsStore {
  props: Props
  popularFolders = []

  async didMount() {
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

  get source() {
    return this.props.source
  }

  onSyncSetter = id => () => {
    console.log('should set', id)
    return false
  }

  get service(): any {
    // todo: broken by umed please fix me
    // console.log('get service again')
    return {} // this.props.sourcesStore.services.drive
  }
}

export const DriveSettings = observer((props: Props) => {
  const store = useStore(DriveSettingsStore)
  const folders = store.popularFolders

  return (
    <>
      <SettingManageRow source={props.source} whitelist={null} />
      <View flex={1} opacity={1} pointerEvents={'auto'}>
        <SearchableTable
          virtual
          rowLineHeight={28}
          floating={false}
          columnSizes={{
            name: 'flex',
            active: '14%',
          }}
          columns={{
            name: {
              value: 'Folder Name',
              sortable: true,
              resizable: true,
            },
            active: {
              value: 'Active',
              sortable: true,
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
                  value: <ReactiveCheckBox isActive={store.onSyncSetter(file.id)} />,
                },
              },
            }
          })}
          bodyPlaceholder={
            <div style={{ margin: 'auto' }}>
              <Text size={1.2}>Loading...</Text>
            </div>
          }
        />
      </View>
    </>
  )
})
