import { Absolute } from '@mcro/gloss'
import { App } from '@mcro/models'
import { Text, View } from '@mcro/ui'
import React from 'react'
import { SelectableGrid } from '../../components/SelectableGrid'
import { useActiveAppsSorted } from '../../hooks/useActiveAppsSorted'
import { useAppSortHandler } from '../../hooks/useAppSortHandler'
import { RoundButton, Title } from '../../views'
import { AppIcon } from '../../views/AppIcon'
import { Icon } from '../../views/Icon'
import { Section } from '../../views/Section'
import { GetSortableItem } from '../../views/SortableGrid'

export default function AppsMainManage() {
  const activeApps = useActiveAppsSorted()
  const handleSortEnd = useAppSortHandler()
  const activeItems = activeApps.map(x => ({
    id: x.id,
    title: x.name,
    icon: <AppIcon app={x} size={58} />,
    type: 'installed',
    group: 'Installed Apps',
    after: <RoundButton circular icon="remove" />,
  }))
  const results = [
    ...activeItems,
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
    (item, { isSelected, select }) => (
      <View
        key={item.id}
        alignItems="center"
        justifyContent="center"
        margin={10}
        width={98}
        height={98}
        onClick={() => {
          console.log('clcik me...')
          select()
        }}
      >
        <View alignItems="center" position="relative" width={58} height={58}>
          {item.type !== 'add' && (
            <Absolute
              top={2}
              left={2}
              right={2}
              bottom={2}
              borderRadius={17}
              boxShadow={isSelected ? [[0, 0, 10, 'blue']] : null}
              zIndex={-1}
            />
          )}
          {item.icon}
        </View>
        <Text ellipse fontWeight={500} size={0.9}>
          {item.title}
        </Text>
      </View>
    ),
    [resultsKey],
  )

  const getSortableItemProps = React.useCallback<GetSortableItem<App>>(
    app => {
      if (app.editable === false || app.pinned === true) {
        return {
          disabled: true,
        }
      }
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
        getSortableItemProps={getSortableItemProps}
      />
    </Section>
  )
}
