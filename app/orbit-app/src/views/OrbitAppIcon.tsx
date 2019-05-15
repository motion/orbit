import { AppBit, AppIcon } from '@o/kit'
import { getAppContextItems } from '@o/kit-internal'
import { Button, SegmentedRow, Text, useContextMenu, View, ViewProps } from '@o/ui'
import { Absolute, gloss } from 'gloss'
import React from 'react'

type LargeIconProps = ViewProps & {
  icon?: React.ReactNode
  title?: string
  hideShadow?: boolean
  isSelected?: boolean
}

export function LargeIcon({ hideShadow, isSelected, icon, title, ...restProps }: LargeIconProps) {
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
        {!hideShadow && (
          <Absolute
            top={2}
            left={2}
            right={2}
            bottom={2}
            borderRadius={17}
            boxShadow={theme =>
              isSelected ? [[0, 0, 10, theme.alternates.selected.background]] : null
            }
            zIndex={-1}
          />
        )}
        {icon}
      </View>
      <Text ellipse fontWeight={500} size={0.9}>
        {title}
      </Text>
    </View>
  )
}

export function OrbitAppIcon({
  app,
  ...props
}: LargeIconProps & {
  app: AppBit
  isSelected?: boolean
}) {
  console.log('app', app)
  const contextMenuProps = useContextMenu({ items: getAppContextItems(app) })
  return (
    <AppIconContainer>
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
  )
}

export const AppIconContainer = gloss({
  height: 180,
  padding: 10,
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  borderRadius: 10,
}).theme((_, theme) => ({
  '&:hover': {
    background: theme.backgroundStrong,
  },
}))
