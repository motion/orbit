import { Absolute, gloss, ViewProps } from '@mcro/gloss'
import { AppIcon, useActiveAppsSorted } from '@mcro/kit'
import { AppBit } from '@mcro/models'
import { Icon, Section, Text, useContextMenu, View } from '@mcro/ui'
import React from 'react'
import { SelectableGrid } from '../../components/SelectableGrid'
import { getAppContextItems } from '../../helpers/getAppContextItems'
import { useActions } from '../../hooks/useActions'
import { useAppSortHandler } from '../../hooks/useAppSortHandler'
import { useStores } from '../../hooks/useStores'
import { TitleRow } from '../../views/TitleRow'

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
  height: 180,
  padding: [15, 25],
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
}).theme((_, theme) => ({
  '&:hover': {
    background: theme.backgroundHover,
  },
}))

export function AppsMainManage() {
  const { paneManagerStore } = useStores()
  const Actions = useActions()
  const activeApps = useActiveAppsSorted()
  const handleSortEnd = useAppSortHandler()
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
    {
      id: '10000',
      icon: (
        <View width={58} height={58} alignItems="center" justifyContent="center">
          <Icon name="add" size={32} opacity={0.25} />
        </View>
      ),
      onDoubleClick: Actions.setupNewApp,
      title: 'Add',
      type: 'add',
      onClick: () => {},
      disabled: true,
    },
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
    <Section sizePadding={0}>
      <TitleRow bordered sizePadding={2} margin={0}>
        Apps
      </TitleRow>
      <SelectableGrid
        autoFitColumns
        minWidth={160}
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
