import { GmailSetting as GmailSettingModel } from '@mcro/models'
import * as React from 'react'
import { view } from '@mcro/black'
import { ReactiveCheckBox } from '../../../../views/ReactiveCheckBox'
import { WhitelistManager } from './stores/WhitelistManager'
import { SearchableTable, Text, View } from '@mcro/ui'
import { SettingManageRow } from './views/SettingManageRow'
import { PeekSettingProps } from '../PeekSetting'
import { SimpleAppExplorer } from './views/SimpleAppExplorer'

type Props = PeekSettingProps<GmailSettingModel>

class GmailSettingStore {
  props: Props
  syncing = {}
  whitelist = new WhitelistManager({
    setting: this.props.setting,
    getAll: this.getAllFilterIds.bind(this),
  })

  willUnmount() {
    this.whitelist.dispose()
  }

  private getAllFilterIds() {
    return this.props.setting.values.foundEmails
  }
}

@view.attach({ store: GmailSettingStore })
@view
export class GmailSetting extends React.Component<Props & { store?: GmailSettingStore }> {
  render() {
    const { store, setting } = this.props
    return (
      <SimpleAppExplorer
        setting={setting}
        settingsPane={
          <>
            <SettingManageRow store={store} setting={setting} />
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
                rows={(setting.values.foundEmails || []).map((email, index) => {
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
                            onChange={store.whitelist.updateWhitelistValueSetter(email)}
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
          </>
        }
      />
    )
  }
}
