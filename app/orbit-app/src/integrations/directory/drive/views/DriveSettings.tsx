import * as React from 'react'
import { view, attach } from '@mcro/black'
import { ReactiveCheckBox } from '../../../../views/ReactiveCheckBox'
import { Text, SearchableTable, View } from '@mcro/ui'
import { DriveSource } from '@mcro/models'
import { OrbitSourceSettingProps } from '../../../types'
import { SimpleAppExplorer } from '../../../views/apps/SimpleAppExplorer'
import { SettingManageRow } from '../../../views/settings/SettingManageRow'

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
    return {} // this.props.appsStore.services.drive
  }
}

@attach({ store: DriveSettingsStore })
@view
export class DriveSettings extends React.Component<
  Props & {
    store?: DriveSettingsStore
  }
> {
  render() {
    const {
      store,
      source,
      appConfig: {
        viewConfig: { initialState },
      },
    } = this.props
    const folders = store.popularFolders

    return (
      <SimpleAppExplorer
        source={source}
        initialState={initialState}
        settingsPane={
          <>
            <SettingManageRow source={source} whitelist={null} />
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
