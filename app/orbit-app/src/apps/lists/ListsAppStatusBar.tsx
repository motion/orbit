import { Breadcrumbs, ButtonProps, Text, useBreadcrumb, View } from '@mcro/ui'
import pluralize from 'pluralize'
import React from 'react'
import { FloatingBarButtonSmall } from '../../views/FloatingBar/FloatingBarButtonSmall'
import { Icon } from '../../views/Icon'
import { StatusBarText } from '../../views/StatusBar'
import { ListAppProps } from './ListsApp'

export default function ListAppStatusBar({ store }: ListAppProps) {
  const numItems = Object.keys(store.items).length

  return (
    <>
      <ListAppBreadcrumbs
        items={[
          {
            id: 0,
            name: <Icon name="home" size={12} opacity={0.5} />,
          },
          ...store.history
            .slice(1)
            .filter(Boolean)
            .map(id => store.items[id]),
          store.selectedItem,
        ].filter(Boolean)}
      />
      <View flex={1} />
      <StatusBarText>
        {numItems} {pluralize('item', numItems)}
      </StatusBarText>
    </>
  )
}

function ListCrumb(props: ButtonProps) {
  const { isLast } = useBreadcrumb()

  return (
    <>
      <FloatingBarButtonSmall chromeless {...props} />
      {!isLast ? (
        <Text size={1.5} fontWeight={900} alpha={0.5} margin={[0, 5]} height={4} lineHeight={0}>
          {' · '}
        </Text>
      ) : null}
    </>
  )
}

function ListAppBreadcrumbs(props: { items: { id: any; name: React.ReactNode }[] }) {
  return (
    <View flex={1}>
      <Breadcrumbs>
        {props.items.map((item, index) => (
          <ListCrumb key={`${item.id}${index}`}>{item.name}</ListCrumb>
        ))}
      </Breadcrumbs>
    </View>
  )
}
