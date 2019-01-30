import { Absolute } from '@mcro/gloss'
import { Text, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useMemo } from 'react'
import { Omit } from '../../helpers/typeHelpers/omit'
import { useActiveAppsSorted } from '../../hooks/useActiveAppsSorted'
import { SelectionStore } from '../../stores/SelectionStore'
import { RoundButton, Title } from '../../views'
import { Icon } from '../../views/Icon'
import { Section } from '../../views/Section'
import { SortableGrid, SortableGridProps } from '../../views/SortableGrid'

export default function AppsAppMain() {
  const activeApps = useActiveAppsSorted()
  const activeItems = activeApps.map(x => ({
    id: x.id,
    title: x.name,
    icon: <Icon size={58} name={`orbit-${x.type}-full`} />,
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
    [results.map(x => x.id).join('')],
  )

  return (
    <Section sizePadding={2}>
      <Title>Apps</Title>
      <SelectableGrid margin="auto" items={results} getItem={getItem} />
      {/* <OrbitList sortable items={results} /> */}
    </Section>
  )
}

type SelectableGridProps<A> = Omit<SortableGridProps<any>, 'getItem'> & {
  getItem?: (item: A, { isSelected: boolean, select: Function }) => any
  selectionStore?: SelectionStore
}

const SelectableGrid = React.memo(function SelectableGrid({
  items,
  getItem,
  ...props
}: SelectableGridProps<any>) {
  const selectionStore = props.selectionStore || useStore(SelectionStore)
  const moves = items.map((_, i) => i)
  const itemsKey = JSON.stringify(items.map(i => i.id))

  useEffect(
    () => {
      selectionStore.setResults([{ type: 'column' as 'column', indices: moves }])
    },
    [itemsKey],
  )

  const itemViews = useMemo(
    () => {
      return items.map((item, index) => {
        const select = () => {
          selectionStore.setActiveIndex(index)
        }
        return observer(() => {
          return getItem(item, {
            isSelected: selectionStore.activeIndex === index,
            select,
          })
        })
      })
    },
    [itemsKey],
  )

  return (
    <SortableGrid
      items={items}
      getItem={(_, index) => {
        const ItemView = itemViews[index]
        return <ItemView />
      }}
      {...props}
    />
  )
})
