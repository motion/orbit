import { Absolute, gloss, ViewProps } from '@o/gloss'
import { AppIcon, useActiveAppsSorted, useActiveSpace, useStores } from '@o/kit'
import { getAppContextItems, useAppSortHandler } from '@o/kit-internal'
import { AppBit } from '@o/models'
import { Icon, Section, SelectableGrid, Text, TitleRow, useContextMenu, View } from '@o/ui'
import React from 'react'

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
      <View alignItems="center" position="relative" width={58} height={58}>
        {!hideShadow && (
          <Absolute
            top={2}
            left={2}
            right={2}
            bottom={2}
            borderRadius={17}
            boxShadow={theme => (isSelected ? [[0, 0, 10, theme.selected.background]] : null)}
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
      {app.pinned && (
        <Icon name="pin" position="absolute" top={20} left={20} size={12} opacity={0.35} />
      )}
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
  height: 200,
  padding: [15, 25],
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  borderRadius: 10,
}).theme((_, theme) => ({
  '&:hover': {
    background: theme.backgroundHover.alpha(0.05),
  },
}))

export function SearchHome() {
  const { paneManagerStore } = useStores()
  const activeApps = useActiveAppsSorted()
  const handleSortEnd = useAppSortHandler()
  const [activeSpace] = useActiveSpace()

  const results = [
    ...activeApps.map(x => ({
      id: x.id,
      title: x.name,
      type: 'installed',
      group: 'Installed Apps',
      disabled: x.pinned || x.editable === false,
      onDoubleClick: () => {
        paneManagerStore.setActivePane(`${x.id}`)
        console.log('double 2', x)
      },
    })),
  ]

  const resultsKey = results.map(x => x.id).join('')

  const getItem = React.useCallback(
    ({ onClick, onDoubleClick, ...item }, { isSelected, select }) => {
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
          app={activeApps.find(x => x.id === item.id)}
          isSelected={isSelected}
          onClick={select}
          onDoubleClick={onDoubleClick}
        />
      )
    },
    [resultsKey],
  )

  return (
    <Section>
      <TitleRow size={1.5} bordered>
        {activeSpace ? activeSpace.name : ''}
      </TitleRow>
      <SelectableGrid
        autoFitColumns
        minWidth={180}
        items={results}
        getItem={getItem}
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
