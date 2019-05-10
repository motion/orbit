import { AppBit, AppIcon, useActiveAppsSorted, useActiveSpace } from '@o/kit'
import { getAppContextItems } from '@o/kit-internal'
import { Button, Section, SegmentedRow, SelectableGrid, Text, useContextMenu, useGet, View, ViewProps } from '@o/ui'
import { Absolute, gloss } from 'gloss'
import React, { useCallback } from 'react'

import { useAppSortHandler } from '../hooks/useAppSortHandler'
import { useOm } from '../om/om'

type LargeIconProps = ViewProps & {
  icon?: React.ReactNode
  title?: string
  hideShadow?: boolean
  isSelected?: boolean
}

function LargeIcon({ hideShadow, isSelected, icon, title, ...restProps }: LargeIconProps) {
  return (
    <View
      alignItems="center"
      justifyContent="center"
      margin={10}
      width={98}
      height={98}
      {...restProps}
    >
      {/* marginTop to offset the text height */}
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

function OrbitAppIcon({ app, ...props }: LargeIconProps & { app: AppBit; isSelected?: boolean }) {
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

const AppIconContainer = gloss({
  height: 180,
  padding: 10,
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  borderRadius: 10,
}).theme((_, theme) => ({
  '&:hover': {
    background: theme.backgroundHover.alpha(0.05),
  },
}))

export function ManageApps() {
  const om = useOm()
  const activeApps = useActiveAppsSorted()
  const getActiveApps = useGet(activeApps)
  const handleSortEnd = useAppSortHandler()
  const [activeSpace] = useActiveSpace()

  return (
    <Section
      title={activeSpace ? `${activeSpace.name} Apps` : ''}
      background="transparent"
      titleBorder
    >
      <SelectableGrid
        minWidth={180}
        items={[
          ...activeApps.map(x => ({
            id: x.id,
            title: x.name,
            type: 'installed',
            group: 'Installed Apps',
            disabled: x.tabDisplay !== 'plain',
            onDoubleClick: () => {
              om.actions.router.showAppPage({ id: `${x.id}` })
            },
          })),
        ]}
        getItem={useCallback(({ onClick, onDoubleClick, ...item }, { isSelected, select }) => {
          if (item.type === 'add') {
            // TODO on click to new app pane
            return (
              <AppIconContainer onClick={onClick} onDoubleClick={onDoubleClick}>
                <LargeIcon {...item} />
              </AppIconContainer>
            )
          }
          return (
            <OrbitAppIcon
              app={getActiveApps().find(x => x.id === item.id)}
              isSelected={isSelected}
              onClick={select}
              onDoubleClick={onDoubleClick}
            />
          )
        }, [])}
        distance={10}
        onSortEnd={handleSortEnd}
        getSortableItemProps={item => {
          if (item.disabled) {
            return {
              disabled: true,
            }
          }
        }}
      />
    </Section>
  )
}
