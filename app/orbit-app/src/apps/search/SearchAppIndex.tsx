import { App } from '@mcro/stores'
import { Popover, View } from '@mcro/ui'
import { flow, memoize } from 'lodash'
import * as React from 'react'
import { preventDefault } from '../../helpers/preventDefault'
import { useStores } from '../../hooks/useStores'
import { Icon } from '../../views/Icon'
import SelectableList from '../../views/Lists/SelectableList'
import { AppProps } from '../AppTypes'
import './calendar.css' // theme css file
import SearchItemShare, { SearchItemShareProvide } from './SearchItemShare'

export default function SearchAppIndex(props: AppProps) {
  const { searchStore } = useStores()
  const items = searchStore.searchState.results

  const getItemProps = React.useCallback(
    memoize(({ item }) => {
      if (item && item.target === 'bit') {
        return {
          after: (
            <SearchItemShareProvide item={item}>
              <Popover
                towards="right"
                // selected would otherwise override this theme
                themeName={App.state.isDark ? 'light' : 'dark'}
                distance={5}
                width={250}
                height={300}
                target={
                  <View
                    alignItems="center"
                    justifyContent="center"
                    width={34}
                    opacity={0.5}
                    hoverStyle={{ opacity: 1 }}
                    onClick={flow(
                      preventDefault,
                      () => console.log('show popover'),
                    )}
                  >
                    <Icon name="dots" size={12} />
                  </View>
                }
                openOnClick
                closeOnClickAway
                group="filters"
                background
                borderRadius={10}
                elevation={1}
              >
                {isShown => isShown && <SearchItemShare />}
              </Popover>
            </SearchItemShareProvide>
          ),
        }
      }
      return null
    }),
    [items.map(i => `${i.id}`).join(' ')],
  )

  return (
    <SelectableList
      minSelected={0}
      items={items}
      query={props.appStore.activeQuery}
      getItemProps={getItemProps}
    />
  )
}
