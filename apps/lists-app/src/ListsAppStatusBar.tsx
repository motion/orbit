import { Icon } from '@o/kit'
import { Breadcrumbs, Button, ButtonProps, StatusBarText, Text, useBreadcrumb, View } from '@o/ui'
import pluralize from 'pluralize'
import React from 'react'

export function ListAppStatusBar() {
  const numItems = 0

  return (
    <>
      <ListAppBreadcrumbs
        items={[
          {
            id: 0,
            name: <Icon name="home" size={12} opacity={0.5} />,
          },
          // ...listStore.history
          //   .slice(1)
          //   .filter(Boolean)
          //   .map(id => listStore.items[id]),
          // listStore.selectedItem,
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
      <Button {...props} />
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
