import * as React from 'react'
import { view } from '@mcro/black'
import { ReactiveCheckBox } from '../../../../views/ReactiveCheckBox'
import { Text, SearchableTable, View } from '@mcro/ui'
import { DriveSetting } from '@mcro/models'
import { OrbitAppSettingProps } from '../../../types'
import { SimpleAppExplorer } from '../../../views/SimpleAppExplorer'
import { SettingManageRow } from '../../../views/SettingManageRow'

type Props = OrbitAppSettingProps<DriveSetting>

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

  get setting() {
    return this.props.setting
  }

  onSyncSetter = id => () => {
    console.log('should set', id)
    return false
  }

  get service(): any {
    // todo: broken by umed please fix me
    // console.log('get service again')
    return {} // this.props.appsStore.services.drive
  }
}

@view.attach({ store: DriveSettingsStore })
@view
export class DriveSettings extends React.Component<
  Props & {
    store?: DriveSettingsStore
  }
> {
  render() {
    const {
      store,
      setting,
      appConfig: {
        viewConfig: { initialState },
      },
    } = this.props
    const folders = store.popularFolders

    return (
      <SimpleAppExplorer
        setting={setting}
        initialState={initialState}
        settingsPane={
          <>
            <SettingManageRow setting={setting} whitelist={null} />
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
                        value: (
                          <ReactiveCheckBox isActive={this.props.store.onSyncSetter(file.id)} />
                        ),
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
        }
      />
    )
  }
}
