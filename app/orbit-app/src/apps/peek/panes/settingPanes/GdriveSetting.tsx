import * as React from 'react'
import { view, react, compose } from '@mcro/black'
import { SettingPaneProps } from './SettingPaneProps'
import { HideablePane } from '../../views/HideablePane'
import { DriveService } from '@mcro/services'
import { ReactiveCheckBox } from '../../../../views/ReactiveCheckBox'
import { Text, SearchableTable, Tabs, Tab } from '@mcro/ui'

const columnSizes = {
  name: 'flex',
  active: '10%',
}

const columns = {
  name: {
    value: 'Folder Name',
    sortable: true,
    resizable: true,
  },
  active: {
    value: 'Active',
    sortable: true,
  },
}

const itemToRow = (index, file, isActive = false) => ({
  key: `${index}`,
  columns: {
    name: {
      sortValue: file.name,
      value: file.name,
    },
    active: {
      sortValue: isActive,
      value: (
        <ReactiveCheckBox
          // onChange={onSync(channel.id)}
          isActive={() => isActive}
        />
      ),
    },
  },
})

class GDocsSettingStore {
  props: SettingPaneProps
  active = 'folders'

  get setting() {
    return this.props.setting
  }

  get service(): DriveService {
    console.log('get service again')
    return this.props.appStore.services.gdrive
  }

  setActiveKey = key => {
    this.active = key
  }

  popularFolders = react(
    async () => {
      const res = await this.service.fetch('/files', {
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
      return res.files.map((file, index) => itemToRow(index, file))
    },
    {
      defaultValue: [],
    },
  )
}

const decorator = compose(
  view.attach({ store: GDocsSettingStore }),
  view,
)

type Props = SettingPaneProps & { store: GDocsSettingStore }

export const GdriveSetting = decorator(({ store, children }: Props) => {
  const folders = store.popularFolders
  console.log('folders, ', folders)
  return children({
    belowHead: (
      <Tabs active={store.active} onActive={store.setActiveKey}>
        <Tab key="folders" width="50%" label="Folders" />
        <Tab key="settings" width="50%" label="Settings" />
      </Tabs>
    ),
    content: (
      <>
        <HideablePane visible={store.active !== 'folders'}>
          <SearchableTable
            virtual
            rowLineHeight={28}
            floating={false}
            columnSizes={columnSizes}
            columns={columns}
            multiHighlight
            rows={folders}
            bodyPlaceholder={
              <div style={{ margin: 'auto' }}>
                <Text size={1.2}>Loading...</Text>
              </div>
            }
          />
        </HideablePane>
        <HideablePane visible={store.active !== 'issues'} />
      </>
    ),
  })
})
