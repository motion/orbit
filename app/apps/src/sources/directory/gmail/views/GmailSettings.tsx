import { GmailSource } from '@mcro/models'
import { SearchableTable, Text, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import * as React from 'react'
import ReactiveCheckBox from '../../../../views/ReactiveCheckBox'
import { WhitelistManager } from '../../../helpers/WhitelistManager'
import { OrbitSourceSettingProps } from '../../../types'
import { SettingManageRow } from '../../../views/settings/SettingManageRow'

type Props = OrbitSourceSettingProps<GmailSource>

export default function GmailSettings(props: Props) {
  const whitelist = useStore(WhitelistManager, {
    source: props.source,
    getAll: () => props.source.values.foundEmails,
  })
  const { source } = props
  return (
    <>
      <SettingManageRow source={source} whitelist={whitelist} />
      <View
        flex={1}
        opacity={whitelist.isWhitelisting ? 0.5 : 1}
        pointerEvents={whitelist.isWhitelisting ? 'none' : 'inherit'}
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
            const isActive = whitelist.whilistStatusGetter(email)
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
                      onChange={whitelist.updateWhitelistValueSetter(email)}
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
