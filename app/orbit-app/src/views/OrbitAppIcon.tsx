import { AppBit, AppIcon, removeApp } from '@o/kit'
import { getAppContextItems } from '@o/kit-internal'
import { Button, IconLabeled, IconLabeledProps, useContextMenu, SurfacePassProps } from '@o/ui'
import { Box, gloss, Theme, Row } from 'gloss'
import React, { memo } from 'react'

export const OrbitAppIcon = memo(
  ({
    app,
    isSelected,
    ...props
  }: IconLabeledProps & {
    app: AppBit
    isSelected?: boolean
  }) => {
    const contextMenuProps = useContextMenu({ items: getAppContextItems(app) })
    return (
      <Theme alt={isSelected ? 'selected' : undefined}>
        <AppIconContainer isSelected={isSelected}>
          <SurfacePassProps chromeless iconSize={12} opacity={0.5}>
            <Row position="absolute" top={10} right={10}>
              {app.tabDisplay === 'permanent' && <Button icon="lock" />}
              {app.tabDisplay === 'pinned' && (
                <Button hoverStyle={{ opacity: 1 }} tooltip="Unpin" icon="pin" />
              )}
              {app.tabDisplay !== 'permanent' && (
                <Button
                  hoverStyle={{ opacity: 1 }}
                  tooltip="Remove"
                  icon="cross"
                  onClick={() => removeApp(app)}
                />
              )}
            </Row>
          </SurfacePassProps>
          <IconLabeled
            {...contextMenuProps}
            label={app.name}
            subTitle={app.identifier}
            icon={<AppIcon identifier={app.identifier} colors={app.colors} size={58} />}
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
