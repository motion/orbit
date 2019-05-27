import { AppBit, AppIcon } from '@o/kit'
import { getAppContextItems } from '@o/kit-internal'
import { Button, SegmentedRow, Text, useContextMenu, View, ViewProps } from '@o/ui'
import { Box, gloss, Theme } from 'gloss'
import React, { memo } from 'react'

type LargeIconProps = ViewProps & {
  icon?: React.ReactNode
  title?: string
}

export function LargeIcon({ icon, title, ...restProps }: LargeIconProps) {
  return (
    <View
      alignItems="center"
      justifyContent="center"
      margin={10}
      width={98}
      height={98}
      {...restProps}
    >
      <View
        marginTop={16}
        marginBottom={6}
        alignItems="center"
        position="relative"
        width={58}
        height={58}
      >
        {icon}
      </View>
      <Text ellipse fontWeight={500} size={0.9}>
        {title}
      </Text>
    </View>
  )
}

export const OrbitAppIcon = memo(
  ({
    app,
    isSelected,
    ...props
  }: LargeIconProps & {
    app: AppBit
    isSelected?: boolean
  }) => {
    const contextMenuProps = useContextMenu({ items: getAppContextItems(app) })
    return (
      <Theme alt={isSelected ? 'selected' : undefined}>
        <AppIconContainer isSelected={isSelected}>
          <View position="absolute" top={20} left={20}>
            <SegmentedRow chromeless iconSize={12} opacity={0.5}>
              {app.tabDisplay === 'permanent' && <Button icon="lock" />}
              {app.tabDisplay === 'pinned' && (
                <Button hoverStyle={{ opacity: 1 }} tooltip="Unpin" icon="pin" />
              )}
              {app.tabDisplay !== 'permanent' && (
                <Button hoverStyle={{ opacity: 1 }} tooltip="Remove" icon="uiremove" />
              )}
            </SegmentedRow>
          </View>
          <LargeIcon
            {...contextMenuProps}
            title={app.name}
            icon={<AppIcon app={app} size={58} />}
            {...props}
          />
        </AppIconContainer>
      </Theme>
    )
  },
)

export const AppIconContainer = gloss<any>(Box, {
  height: 180,
  padding: 10,
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  borderRadius: 10,
}).theme(({ isSelected }, theme) => ({
  background: theme.background,
  '&:hover': {
    background: isSelected ? theme.background : theme.backgroundStrong,
  },
}))
