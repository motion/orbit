import { Icon, Popover, View } from '@mcro/ui'
import { flow, memoize } from 'lodash'
import React from 'react'
import SearchItemShare, { SearchItemShareProvide } from '../apps/search/SearchItemShare'
import { preventDefault } from '../helpers/preventDefault'
import { OrbitListItemProps } from '../views/ListItems/OrbitListItem'
import { useStores } from './useStores'

const getItemShareMenu = memoize((listItem, themeStore) => {
  const item = listItem.item || listItem
  if (item && (item.target === 'bit' || item.target === 'person-bit')) {
    return {
      after: (
        <SearchItemShareProvide item={item}>
          <Popover
            towards="right"
            // selected would otherwise override this theme
            themeName={themeStore.isDark ? 'light' : 'dark'}
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
})

export function useShareMenu() {
  const { themeStore } = useStores()
  return {
    getShareMenuItemProps(item: OrbitListItemProps, _index?, _items?) {
      return getItemShareMenu(item, themeStore)
    },
  }
}
