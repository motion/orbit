import { getNormalPropsForListItem, ListItemSimple, normalizeItem, Portal, Theme, useCurrentDraggable, View } from '@o/ui'
import React, { memo } from 'react'

export const OrbitDraggableOverlay = memo(() => {
  const {
    item,
    position: [x, y],
  } = useCurrentDraggable()
  const activeThemeName = useTheme().name
  if (!item) {
    return null
  }
  return (
    <Portal
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000000000000 }}
    >
      <Theme name={activeThemeName === 'dark' ? 'light' : 'dark'}>
        <View
          position="absolute"
          width={170}
          height={60}
          overflow="hidden"
          background={theme => theme.background}
          borderRadius={5}
          elevation={4}
          style={{
            transform: `translate3d(${x}px, ${y}px, 0)`,
          }}
        >
          <ListItemSimple
            {...getNormalPropsForListItem(item.target === 'bit' ? normalizeItem(item) : item)}
          />
        </View>
      </Theme>
    </Portal>
  )
})
