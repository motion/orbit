import { react } from '@mcro/black'
import { loadOne, observeOne } from '@mcro/model-bridge'
import {
  AppModel,
  AppType,
  BitModel,
  ListAppDataItem,
  ListsApp,
  PersonBitModel,
} from '@mcro/models'
import { Absolute, Button, ButtonProps, Input, PassProps, Row, Text, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { dropRight, flow, last } from 'lodash'
import { observer } from 'mobx-react-lite'
import pluralize from 'pluralize'
import * as React from 'react'
import { lists } from '.'
import { OrbitToolbar } from '../../components/OrbitToolbar'
import { getTargetValue } from '../../helpers/getTargetValue'
import { preventDefault } from '../../helpers/preventDefault'
import { BorderBottom } from '../../views/Border'
import { Breadcrumb, Breadcrumbs } from '../../views/Breadcrumbs'
import { FloatingBarButtonSmall } from '../../views/FloatingBar/FloatingBarButtonSmall'
import SelectableTreeList from '../../views/Lists/SelectableTreeList'
import { AppProps } from '../AppProps'

class ListStore {
  props: AppProps<AppType.lists>

  query = ''
  depth = 0
  history = [0]
  appRaw = react(() => +this.props.id, id => observeOne(AppModel, { args: { where: { id } } }))

  get app() {
    return this.appRaw as ListsApp
  }

  get parentId() {
    return last(this.history)
  }

  get items() {
    return (this.app && this.app.data.items) || {}
  }

  setQuery = val => {
    this.query = val
  }

  back = () => {
    this.depth--
    this.history = dropRight(this.history)
  }
}

export const ListsAppIndex = observer(function ListsAppIndex(props: AppProps<AppType.lists>) {
  const store = useStore(ListStore, props)
  const numItems = Object.keys(store.items).length

  return (
    <>
      <OrbitToolbar
        before={
          <>
            {store.depth > 0 && (
              <FloatingBarButtonSmall icon="arrows-1_bold-left" onClick={store.back}>
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
                name: store.app ? store.app.name : '',
              },
              ...store.history
                .slice(1)
                .filter(Boolean)
                .map(id => store.items[id]),
            ]}
          />
        }
        after={`${numItems} ${pluralize('item', numItems)}`}
      />

      <ListAdd store={store} />
      <ListCurrentFolder store={store} />
    </>
  )
})

const ListCurrentFolder = observer(function ListCurrentFolder({ store }: { store: ListStore }) {
  const { items } = store

  const loadItem = React.useCallback(async item => {
    switch (item.type) {
      case 'folder':
        return {
          title: item.name,
          subtitle: `${item.children.length} items`,
          after: <Button circular chromeless size={0.9} icon="arrowright" onClick={store.back} />,
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
    store.depth = depth
    store.history = history
  }, [])

  return (
    <SelectableTreeList
      minSelected={0}
      rootItemID={0}
      items={items}
      loadItem={loadItem}
      sortable
      getContextMenu={getContextMenu}
      onChangeDepth={onChangeDepth}
      depth={store.depth}
    />
  )
})

const addFolder = (store: ListStore) => {
  lists.actions.receive(store.app, store.parentId, {
    target: 'folder',
    name: store.query,
  })
  store.setQuery('')
}

const ListAdd = observer(function ListAdd({ store }: { store: ListStore }) {
  return (
    <Row position="relative">
      <BorderBottom opacity={0.5} />
      <Input
        chromeless
        sizeRadius={0}
        paddingLeft={12}
        paddingRight={40}
        height={35}
        value={store.query}
        onChange={flow(
          preventDefault,
          getTargetValue,
          store.setQuery,
        )}
        onEnter={() => addFolder(store)}
        flex={1}
        placeholder="Add..."
      />
      <Absolute top={0} right={12} bottom={0}>
        <Row flex={1} alignItems="center">
          <PassProps chromeless opacity={0.5} hoverOpacity={1}>
            <Button tooltip="Add" icon="add" />
            <Button tooltip="Create folder" icon="folder" onClick={() => addFolder(store)} />
          </PassProps>
        </Row>
      </Absolute>
    </Row>
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
