import { loadOne, useObserveOne } from '@mcro/model-bridge'
import {
  AppModel,
  AppType,
  BitModel,
  ListAppDataItem,
  ListsApp,
  PersonBitModel,
} from '@mcro/models'
import { Absolute, Button, ButtonProps, Input, PassProps, Row, Text, View } from '@mcro/ui'
import { last } from 'lodash'
import { observer } from 'mobx-react-lite'
import pluralize from 'pluralize'
import * as React from 'react'
import OrbitFloatingBar from '../../components/OrbitFloatingBar'
import { OrbitToolbar } from '../../components/OrbitToolbar'
import { BorderBottom } from '../../views/Border'
import { Breadcrumb, Breadcrumbs } from '../../views/Breadcrumbs'
import { FloatingBarButtonSmall } from '../../views/FloatingBar/FloatingBarButtonSmall'
import SelectableTreeList, { SelectableTreeRef } from '../../views/Lists/SelectableTreeList'
import { AppProps } from '../AppProps'
import ListEdit from './ListEdit'

export const ListsAppIndex = observer(function ListsAppIndex(props: AppProps<AppType.lists>) {
  const listApp = useObserveOne(AppModel, { where: { id: +props.id } }) as ListsApp
  const items = (listApp && listApp.data.items) || {}
  const treeRef = React.useRef<SelectableTreeRef>(null)
  const [treeState, setTreeState] = React.useState({ depth: 0, history: [0] })
  const getDepth = React.useRef(0)
  getDepth.current = treeState.depth

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

  const numItems = (listApp && Object.keys(listApp.data.items).length) || 0

  return (
    <>
      <OrbitToolbar
        before={
          <>
            {treeState.depth > 0 && (
              <FloatingBarButtonSmall
                icon="arrows-1_bold-left"
                onClick={() => {
                  treeRef.current.back()
                }}
              >
                Back
              </FloatingBarButtonSmall>
            )}
          </>
        }
        center={
          <ListAppBreadcrumbs
            items={[
              {
                id: 0,
                name: listApp ? listApp.name : '',
              },
              ...treeState.history
                .slice(1)
                .filter(Boolean)
                .map(id => items[id]),
            ]}
          />
        }
        after={`${numItems} ${pluralize('item', numItems)}`}
      />

      <Row position="relative">
        <BorderBottom opacity={0.5} />
        <Input
          chromeless
          sizeRadius={0}
          paddingLeft={12}
          paddingRight={40}
          height={35}
          // onChange={e => setName(e.target.value)}
          flex={1}
          placeholder="Add..."
        />
        <Absolute top={0} right={12} bottom={0}>
          <Row flex={1} alignItems="center">
            <PassProps chromeless opacity={0.5} hoverOpacity={1}>
              <Button tooltip="Add" icon="add" />
              <Button tooltip="Create folder" icon="folder" />
            </PassProps>
          </Row>
        </Absolute>
      </Row>

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
    <View flex={1}>
      <Breadcrumbs>
        {props.items.map((item, index) => (
          <OrbitBreadcrumb key={`${item.id}${index}`}>{item.name}</OrbitBreadcrumb>
        ))}
      </Breadcrumbs>
    </View>
  )
}
