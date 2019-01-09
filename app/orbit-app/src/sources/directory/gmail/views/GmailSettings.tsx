import * as React from 'react'
import { view, attach } from '@mcro/black'
import { ReactiveCheckBox } from '../../../../views/ReactiveCheckBox'
import { SearchableTable, Text, View } from '@mcro/ui'
import { OrbitSourceSettingProps } from '../../../types'
import { GmailSource } from '@mcro/models'
import { WhitelistManager } from '../../../helpers/WhitelistManager'
import { SettingManageRow } from '../../../views/settings/SettingManageRow'

type Props = OrbitSourceSettingProps<GmailSource>

class GmailSettingStore {
  props: Props
  syncing = {}
  whitelist = new WhitelistManager({
    source: this.props.source,
    getAll: this.getAllFilterIds.bind(this),
  })

  willUnmount() {
    this.whitelist.dispose()
  }

  private getAllFilterIds() {
    return this.props.source.values.foundEmails
  }
}

@attach({ store: GmailSettingStore })
@view
export class GmailSettings extends React.Component<Props & { store?: GmailSettingStore }> {
  render() {
    const { store, source } = this.props
    return (
      <>
        <SettingManageRow source={source} whitelist={store.whitelist} />
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
            rows={(source.values.foundEmails || []).map((email, index) => {
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
    )
  }
}
