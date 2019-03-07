import { Icon, Popover, preventDefault, View } from '@o/ui'
import { flow, memoize } from 'lodash'
import React, { useCallback } from 'react'
import { OrbitListItemProps } from '../views/ListItem'
import { SearchItemShareProvide } from '../views/SearchItemProvide'
import { ShareMenu } from '../views/ShareMenu'
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
                opacity={0.4}
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
            {isShown => isShown && <ShareMenu />}
          </Popover>
        </SearchItemShareProvide>
      ),
    }
  }
  return null
})

export function useShareMenu() {
  const { themeStore } = useStores()
  const getShareMenuItemProps = useCallback(
    (item: OrbitListItemProps, _index?, _items?) => {
      return getItemShareMenu(item, themeStore)
    },
    [themeStore],
  )
  return { getShareMenuItemProps }
}
