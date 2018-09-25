import { GmailSetting as GmailSettingModel } from '@mcro/models'
import * as React from 'react'
import { view } from '@mcro/black'
import { ReactiveCheckBox } from '../../../../views/ReactiveCheckBox'
import { SettingPaneProps } from './SettingPaneProps'
import { HideablePane } from '../../views/HideablePane'
import { AppStatusPane } from './AppStatusPane'
import { WhitelistManager } from './stores/WhitelistManager'
import { Tabs, Tab, SearchableTable, Text, View } from '@mcro/ui'
import { ManageSmartSync } from './views/ManageSmartSync'

type Props = SettingPaneProps & {
  setting: GmailSettingModel
}

class GmailSettingStore {
  props: Props
  syncing = {}
  activeTab = 'status'
  whitelist = new WhitelistManager(this.props.setting)

  willUnmount() {
    this.whitelist.dispose()
  }

  setActiveKey = key => {
    this.activeTab = key
  }

  getAllFilterIds = () => {
    return this.props.setting.values.foundEmails
  }
}

@view.attach({ store: GmailSettingStore })
@view
export class GmailSetting extends React.Component<Props & { store?: GmailSettingStore }> {
  render() {
    const { store, children, setting } = this.props
    return children({
      belowHead: (
        <Tabs active={store.activeTab} onActive={store.setActiveKey}>
          <Tab key="status" width="50%" label="Status" />
          <Tab key="filters" width="50%" label="Filters" />
        </Tabs>
      ),
      content: (
        <>
          <HideablePane invisible={store.activeTab !== 'status'}>
            <AppStatusPane setting={setting} />
          </HideablePane>
          <HideablePane invisible={store.activeTab !== 'filters'}>
            <ManageSmartSync whitelist={store.whitelist} />
            <View
              flex={1}
              opacity={store.whitelist.isWhitelisting ? 0.5 : 1}
              pointerEvents={store.whitelist.isWhitelisting ? 'none' : 'auto'}
            >
              <SearchableTable
                virtual
                rowLineHeight={28}
                floating={false}
                columnSizes={{
                  filter: 'flex',
                  active: '14%',
                }}
                columns={{
                  filter: {
                    value: 'Filter',
                    sortable: true,
                    resizable: true,
                  },
                  active: {
                    value: 'Active',
                    sortable: true,
                  },
                }}
                multiHighlight
                rows={setting.values.foundEmails.map((email, index) => {
                  const isActive = store.whitelist.whilistStatusGetter(email)
                  return {
                    key: `${index}`,
                    columns: {
                      filter: {
                        sortValue: email,
                        value: email,
                      },
                      active: {
                        sortValue: isActive,
                        value: (
                          <ReactiveCheckBox
                            onChange={store.whitelist.updateWhitelistValueSetter(
                              email,
                              store.getAllFilterIds,
                            )}
                            isActive={isActive}
                          />
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
          </HideablePane>
        </>
      ),
    })
  }
}
