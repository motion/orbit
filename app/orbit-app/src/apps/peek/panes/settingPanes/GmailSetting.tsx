import * as React from 'react'
import * as UI from '@mcro/ui'
import { view, compose } from '@mcro/black'
import { ReactiveCheckBox } from '../../../../views/ReactiveCheckBox'
import { SettingPaneProps } from './SettingPaneProps'
import { HideablePane } from '../../views/HideablePane'
import { SettingRepository } from '../../../../repositories'
import { GmailSettingValues } from '@mcro/models'
import { AppStatusPane } from './AppStatusPane'

const columnSizes = {
  filter: 'flex',
  active: '14%',
}

const columns = {
  filter: {
    value: 'Filter',
    sortable: true,
    resizable: true,
  },
  active: {
    value: 'Active',
    sortable: true,
  },
}

const itemToRow = (filter, index, onSync) => ({
  key: `${index}`,
  columns: {
    filter: {
      sortValue: filter.name,
      value: filter.name,
    },
    active: {
      sortValue: filter.isActive,
      value: (
        <ReactiveCheckBox
          onChange={onSync(filter.id)}
          isActive={filter.isActive}
        />
      ),
    },
  },
})

class GmailSettingStore {
  props: SettingPaneProps

  syncing = {}
  active = 'status'

  setActiveKey = key => {
    this.active = key
  }

  get setting() {
    return this.props.setting
  }

  get values() {
    return this.setting.values as GmailSettingValues
  }

  get whiteList() {
    const { whiteList } = this.values
    if (whiteList) {
      let a = []
      for (const id in whiteList) {
        a.push({ id, name: id, isActive: () => whiteList[id] })
      }
      return a
    }
    return []
  }

  get rows() {
    return this.whiteList.map((item, index) =>
      itemToRow(item, index, this.onSync),
    )
  }

  onSync = fullName => async e => {
    this.setting.values = {
      ...this.values,
      channels: {
        ...this.values.whiteList,
        [fullName]: e.target.checked,
      },
    }
    await SettingRepository.save(this.setting)
  }

  isSyncing = fullName => {
    if (!this.setting || !this.values.whiteList) {
      return false
    }
    return this.values.whiteList[fullName] || false
  }
}

const decorator = compose(
  view.attach({ store: GmailSettingStore }),
  view,
)

type Props = SettingPaneProps & { store: GmailSettingStore }

export const GmailSetting = decorator(({ store, children }: Props) => {
  return children({
    belowHead: (
      <UI.Tabs active={store.active} onActive={store.setActiveKey}>
        <UI.Tab key="status" width="50%" label="Status" />
        <UI.Tab key="filters" width="50%" label="Filters" />
      </UI.Tabs>
    ),
    content: (
      <>
        <HideablePane invisible={store.active !== 'status'}>
          <AppStatusPane setting={store.setting} />
        </HideablePane>
        <HideablePane invisible={store.active !== 'filters'}>
          <UI.SearchableTable
            virtual
            rowLineHeight={28}
            floating={false}
            columnSizes={columnSizes}
            columns={columns}
            multiHighlight
            rows={store.rows}
            bodyPlaceholder={
              <div style={{ margin: 'auto' }}>
                <UI.Text size={1.2}>Loading...</UI.Text>
              </div>
            }
          />
        </HideablePane>
      </>
    ),
  })
})
