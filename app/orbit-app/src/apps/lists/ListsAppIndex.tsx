import { loadOne, useObserveOne } from '@mcro/model-bridge'
import {
  AppModel,
  AppType,
  BitModel,
  ListAppDataItem,
  ListsApp,
  PersonBitModel,
} from '@mcro/models'
import { Button, ButtonProps, Text, View } from '@mcro/ui'
import { last } from 'lodash'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import OrbitFloatingBar from '../../components/OrbitFloatingBar'
import { OrbitToolbar } from '../../components/OrbitToolbar'
import { HorizontalSpace } from '../../views'
import { Breadcrumb, Breadcrumbs } from '../../views/Breadcrumbs'
import { FloatingBarButtonSmall } from '../../views/FloatingBar/FloatingBarButtonSmall'
import SelectableTreeList, { SelectableTreeRef } from '../../views/Lists/SelectableTreeList'
import { AppProps } from '../AppProps'
import ListEdit from './ListEdit'

export const ListsAppIndex = observer(function ListsAppIndex(props: AppProps<AppType.lists>) {
  const listApp = useObserveOne(AppModel, { where: { id: props.id } }) as ListsApp
  const items = (listApp && listApp.data.items) || []
  const treeRef = React.useRef<SelectableTreeRef>(null)
  const [treeState, setTreeState] = React.useState({ depth: 0, history: [0] })
  const getDepth = React.useRef(0)
  getDepth.current = treeState.depth

  console.log('items', items)

  const loadItem = React.useCallback(async item => {
    switch (item.type) {
      case 'folder':
        return {
          title: item.name,
          subtitle: `${item.children.length} items`,
          after: (
            <Button
              circular
              chromeless
              size={0.9}
              icon="arrowright"
              onClick={() => setTreeState({ ...treeState, depth: getDepth.current - 1 })}
            />
          ),
        }
      case 'bit':
        return {
          item: await loadOne(BitModel, { args: { where: { id: +item.id } } }),
        }
      case 'person':
        return {
          item: await loadOne(PersonBitModel, { args: { where: { id: +item.id } } }),
        }
    }
    return null
  }, [])

  const getContextMenu = React.useCallback(index => {
    return [
      {
        label: 'Delete',
        click: () => {
          console.log('delete item', index)
        },
      },
    ]
  }, [])

  const onChangeDepth = React.useCallback((depth, history) => {
    setTreeState({ depth, history })
  }, [])

  return (
    <>
      <OrbitToolbar
        before={
          <>
            <View width={30}>
              {treeState.depth > 0 && (
                <FloatingBarButtonSmall
                  circular
                  icon="arrows-1_bold-left"
                  onClick={() => {
                    treeRef.current.back()
                  }}
                />
              )}
            </View>
            <HorizontalSpace />
            {listApp && (
              <ListAppBreadcrumbs
                items={[
                  {
                    id: 0,
                    name: listApp.name,
                  },
                  ...treeState.history
                    .slice(1)
                    .filter(Boolean)
                    .map(id => items[id]),
                ]}
              />
            )}
          </>
        }
      />
      <SelectableTreeList
        ref={treeRef}
        minSelected={0}
        rootItemID={0}
        items={items}
        loadItem={loadItem}
        sortable
        getContextMenu={getContextMenu}
        onChangeDepth={onChangeDepth}
        depth={treeState.depth}
      />
      <OrbitFloatingBar showSearch>
        <ListEdit app={listApp} parentID={last(treeState.history)} />
      </OrbitFloatingBar>
    </>
  )
})

function OrbitBreadcrumb(props: ButtonProps) {
  return (
    <Breadcrumb>
      {isLast => (
        <>
          <FloatingBarButtonSmall chromeless {...props} />
          {!isLast ? (
            <Text size={1.5} fontWeight={900} alpha={0.5} margin={[0, 5]} height={4} lineHeight={0}>
              {' · '}
            </Text>
          ) : null}
        </>
      )}
    </Breadcrumb>
  )
}

function ListAppBreadcrumbs(props: { items: Partial<ListAppDataItem>[] }) {
  return (
    <Breadcrumbs>
      {props.items.map((item, index) => (
        <OrbitBreadcrumb key={`${item.id}${index}`}>{item.name}</OrbitBreadcrumb>
      ))}
    </Breadcrumbs>
  )
}
