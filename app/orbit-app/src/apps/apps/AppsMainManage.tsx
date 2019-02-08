import { Absolute, ViewProps } from '@mcro/gloss'
import { App } from '@mcro/models'
import { Text, useContextMenu, View } from '@mcro/ui'
import React from 'react'
import { SelectableGrid } from '../../components/SelectableGrid'
import { getAppContextItems } from '../../helpers/getAppContextItems'
import { useActiveAppsSorted } from '../../hooks/useActiveAppsSorted'
import { useAppSortHandler } from '../../hooks/useAppSortHandler'
import { Title } from '../../views'
import { AppIcon } from '../../views/AppIcon'
import { Icon } from '../../views/Icon'
import { Section } from '../../views/Section'

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

function OrbitAppIcon({ app, ...props }: LargeIconProps & { app: App; isSelected?: boolean }) {
  const contextMenuProps = useContextMenu({ items: getAppContextItems(app) })
  return (
    <LargeIcon
      {...contextMenuProps}
      title={app.name}
      icon={<AppIcon app={app} size={58} />}
      {...props}
    />
  )
}

export default function AppsMainManage() {
  const activeApps = useActiveAppsSorted()
  const handleSortEnd = useAppSortHandler()
  const results = [
    ...activeApps.map(x => ({
      id: x.id,
      title: x.name,
      type: 'installed',
      group: 'Installed Apps',
      disabled: x.pinned || x.editable === false,
    })),
    {
      id: '10000',
      icon: (
        <View width={58} height={58} alignItems="center" justifyContent="center">
          <Icon name="add" size={32} opacity={0.25} />
        </View>
      ),
      title: 'Add',
      type: 'add',
      onClick: () => {},
      disabled: true,
    },
  ]

  const resultsKey = results.map(x => x.id).join('')

  const getItem = React.useCallback(
    (item, { isSelected, select }) => {
      if (item.type === 'add') {
        // TODO on click to new app pane
        return <LargeIcon {...item} />
      }
      return (
        <OrbitAppIcon
          app={activeApps.find(x => x.id === item.id)}
          isSelected={isSelected}
          onClick={select}
        />
      )
    },
    [resultsKey],
  )

  return (
    <Section sizePadding={2}>
      <Title>Apps</Title>
      <SelectableGrid
        margin="auto"
        items={results}
        getItem={getItem}
        onSortEnd={handleSortEnd}
        getSortableItemProps={item => {
          // console.log('item', item)
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
