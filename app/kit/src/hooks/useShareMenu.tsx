import { Icon, ListItemProps, Popover, preventDefault, View } from '@o/ui'
import { flow, memoize } from 'lodash'
import React, { useCallback } from 'react'

import { SearchItemShareProvide } from '../views/SearchItemProvide'
import { ShareMenu } from '../views/ShareMenu'
import { useStores } from './useStores'

const getItemShareMenu = memoize((listItem, themeStore) => {
  if (!listItem) {
    return null
  }

  const item = listItem.item || listItem
  if (item && (item.target === 'bit' || item.target === 'person-bit')) {
    return {
      after: (
        <SearchItemShareProvide item={item}>
          {/* @ts-ignore */}
          <Popover
            towards="right"
            // selected would otherwise override this theme
            popoverTheme={themeStore.isDark ? 'light' : 'dark'}
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
  const { themeStore } = useStores({ optional: ['themeStore'] })
  const getShareMenuItemProps = useCallback(
    (item: ListItemProps) => {
      if (themeStore) {
        return getItemShareMenu(item, themeStore)
      }
      return {}
    },
    [themeStore],
  )
  return { getShareMenuItemProps }
}
