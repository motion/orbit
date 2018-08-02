import * as React from 'react'
import { view, react, compose } from '@mcro/black'
import { SettingPaneProps } from './SettingPaneProps'
import * as UI from '@mcro/ui'
import { InvisiblePane } from '../../views/InvisiblePane'
import { DriveService } from '@mcro/services'
import { ReactiveCheckBox } from '../../../../views/ReactiveCheckBox'

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
    return this.props.appStore.services.gdocs
  }

  setActiveKey = key => {
    this.active = key
  }

  popularFolders = react(
    async () => {
      const res = await this.service.fetch('/files', {
        query: {
          q: 'mimeType="application/vnd.google-apps.folder"',
          orderBy: [
            'modifiedByMeTime desc',
            'modifiedTime desc',
            'sharedWithMeTime desc',
            'viewedByMeTime desc',
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

export const GdocsSetting = decorator(({ store, children }: Props) => {
  const folders = store.popularFolders
  console.log('folders, ', folders)
  return children({
    subhead: (
      <UI.Tabs active={store.active} onActive={store.setActiveKey}>
        <UI.Tab key="folders" width="50%" label="Folders" />
        <UI.Tab key="settings" width="50%" label="Settings" />
      </UI.Tabs>
    ),
    content: (
      <>
        <InvisiblePane visible={store.active === 'folders'}>
          <UI.SearchableTable
            virtual
            rowLineHeight={28}
            floating={false}
            columnSizes={columnSizes}
            columns={columns}
            multiHighlight
            rows={folders}
            bodyPlaceholder={
              <div style={{ margin: 'auto' }}>
                <UI.Text size={1.2}>Loading...</UI.Text>
              </div>
            }
          />
        </InvisiblePane>
        <InvisiblePane visible={store.active === 'issues'} />
      </>
    ),
  })
})
