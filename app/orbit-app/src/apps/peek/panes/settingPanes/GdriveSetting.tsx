import * as React from 'react'
import { view } from '@mcro/black'
import { SettingPaneProps } from './SettingPaneProps'
import { HideablePane } from '../../views/HideablePane'
import { ReactiveCheckBox } from '../../../../views/ReactiveCheckBox'
import { Text, SearchableTable, Tabs, Tab } from '@mcro/ui'
import { AppStatusPane } from './AppStatusPane'

class GDocsSettingStore {
  props: SettingPaneProps
  active = 'status'
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
    return {} // this.props.appsStore.services.gdrive
  }

  setActiveKey = key => {
    this.active = key
  }
}

@view.attach({ store: GDocsSettingStore })
@view
export class GdriveSetting extends React.Component<
  SettingPaneProps & {
    store?: GDocsSettingStore
  }
> {
  render() {
    const { store, setting, children } = this.props
    const folders = store.popularFolders
    return children({
      belowHead: (
        <Tabs active={store.active} onActive={store.setActiveKey}>
          <Tab key="status" width="50%" label="Status" />
          <Tab key="folders" width="50%" label="Manage" />
        </Tabs>
      ),
      content: (
        <>
          <HideablePane invisible={store.active !== 'status'}>
            <AppStatusPane setting={setting} />
          </HideablePane>
          <HideablePane invisible={store.active !== 'folders'}>
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
                      value: <ReactiveCheckBox isActive={this.props.store.onSyncSetter(file.id)} />,
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
          </HideablePane>
        </>
      ),
    })
  }
}
