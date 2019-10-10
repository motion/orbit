import { AppBit, AppIcon, removeApp, useAppDefinition } from '@o/kit'
import { getAppContextItems } from '@o/kit-internal'
import { Button, IconLabeled, IconLabeledProps, Stack, SurfacePassProps, useBanner, useContextMenu } from '@o/ui'
import { Box, gloss, Theme } from 'gloss'
import React, { memo } from 'react'

export type OrbitAppIconProps = IconLabeledProps & {
  app: AppBit
  isSelected?: boolean
  removable?: boolean
}

export const OrbitAppIcon = memo(
  ({ app, isSelected, size = 58, removable, ...props }: OrbitAppIconProps) => {
    const definition = useAppDefinition(app.identifier)
    const contextMenuProps = useContextMenu({ items: getAppContextItems(app) })
    const banner = useBanner()
    const isPermanent = app.tabDisplay === 'permanent' || app.tabDisplay === 'permanentLast'
    return (
      <Theme coat={isSelected ? 'selected' : undefined}>
        <AppIconContainer isSelected={isSelected} isDraggable={!isPermanent}>
          <SurfacePassProps chromeless iconSize={12} opacity={0.5}>
            <Stack direction="horizontal" position="absolute" top={10} right={10}>
              {isPermanent && <Button icon="lock" />}
              {app.tabDisplay === 'pinned' && (
                <Button hoverStyle={{ opacity: 1 }} tooltip="Unpin" icon="pin" />
              )}
              {removable && !isPermanent && (
                <Button
                  hoverStyle={{ opacity: 1 }}
                  tooltip="Remove"
                  icon="cross"
                  onClick={() => removeApp(app, banner)}
                />
              )}
            </Stack>
          </SurfacePassProps>
          <IconLabeled
            {...contextMenuProps}
            label={app.name}
            subTitle={definition ? definition.name : app.identifier}
            icon={<AppIcon identifier={app.identifier} colors={app.colors} size={size} />}
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
}).theme(theme => ({
  background: theme.isSelected ? theme.background : 'transparent',
  opacity: 2,
  '&:hover': {
    background: theme.isSelected || !theme.isDraggable ? theme.background : theme.backgroundStrong,
  },
}))
