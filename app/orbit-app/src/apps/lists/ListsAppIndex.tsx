import { loadOne, useModel, useObserveMany } from '@mcro/model-bridge'
import { AppModel, AppType, BitModel, ListsAppData, PersonBitModel } from '@mcro/models'
import { Button, ButtonProps, Text, View } from '@mcro/ui'
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

// class ListsIndexStore {
//   props: AppProps<AppType.lists>
//   stores = useHook(useStoresSafe)

//   get apps() {
//     return this.stores.spaceStore.apps
//   }

//   get listsApp() {
//     return this.apps.find(app => app.type === AppType.lists) as ListsApp
//   }

//   get allLists() {
//     if (!this.listsApp || !this.listsApp.data || !this.listsApp.data.lists) {
//       return []
//     }
//     return this.listsApp.data.lists.map((listItem, index) => {
//       return {
//         id: index,
//         index,
//         type: 'list',
//         title: listItem.name,
//         after: <Button circular chromeless size={0.9} icon="arrowright" />,
//         subtitle: (listItem.bits || []).length + ' items',
//       }
//     })
//   }

//   get activeQuery() {
//     return this.props.appStore.activeQuery
//   }

//   get results() {
//     return [...this.currentFolderResults, ...this.otherFolderResults, ...this.searchResults]
//   }

//   currentFolderResults = react(
//     () => [this.activeQuery, always(this.allLists)],
//     ([query]) => {
//       return fuzzyQueryFilter(query, this.allLists, {
//         key: 'title',
//       })
//     },
//     { defaultValue: this.allLists },
//   )

//   // TODO make this work
//   otherFolderResults = react(
//     () => [this.activeQuery, always(this.allLists)],
//     ([query]) => {
//       return fuzzyQueryFilter(query, this.allLists, {
//         key: 'title',
//       })
//     },
//     {
//       defaultValue: [],
//     },
//   )

//   searchResults = react(
//     () => [this.activeQuery, this.stores.spaceStore.activeSpace.id, always(this.allLists)],
//     async ([query, spaceId], { sleep }) => {
//       if (query.length < 2 || this.results.length > 10) {
//         return []
//       }
//       // make searchresults lower priority than filtered
//       await sleep(40)
//       const results = await loadMany(SearchResultModel, {
//         args: {
//           spaceId,
//           query,
//           take: 20,
//         },
//       })
//       return results.map(r => ({
//         ...r,
//         group: 'Search Results',
//       }))
//     },
//     {
//       defaultValue: [],
//     },
//   )
// }

export const ListsAppIndex = observer(function ListsAppIndex(props: AppProps<AppType.lists>) {
  const [listApp /* , updateListApp */] = useModel(AppModel, { where: { id: props.id } })

  const testItems = useObserveMany(BitModel, { take: 10 })
  const treeRef = React.useRef<SelectableTreeRef>(null)
  const [depth, setDepth] = React.useState(0)
  const getDepth = React.useRef(depth)

  console.log('treeRef', treeRef, depth)

  if (testItems.length < 4) {
    return null
  }

  console.log('testItems', testItems)

  const items: ListsAppData['items'] = {
    [0]: {
      id: 0,
      type: 'root',
      children: [1, testItems[1].id],
    },
    [1]: {
      id: 1,
      type: 'folder',
      name: 'My folder',
      children: [testItems[2].id, testItems[3].id],
    },
    [testItems[1].id]: {
      id: testItems[1].id,
      type: 'bit',
      children: [],
    },
    [testItems[2].id]: {
      id: testItems[2].id,
      type: 'bit',
      children: [],
    },
    [testItems[3].id]: {
      id: testItems[3].id,
      type: 'bit',
      children: [],
    },
  }

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
              onClick={() => setDepth(getDepth.current - 1)}
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
          console.log('delete item')
        },
      },
    ]
  }, [])

  return (
    <>
      <OrbitToolbar
        before={
          <>
            <View width={30}>
              {depth > 0 && (
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
            <ListAppBreadcrumbs />
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
        onChangeDepth={setDepth}
        depth={depth}
      />
      <OrbitFloatingBar showSearch>
        <ListEdit />
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

function ListAppBreadcrumbs() {
  return (
    <Breadcrumbs>
      <OrbitBreadcrumb>Memory</OrbitBreadcrumb>
      <OrbitBreadcrumb>My folder</OrbitBreadcrumb>
      <OrbitBreadcrumb>Some sub folder 4</OrbitBreadcrumb>
    </Breadcrumbs>
  )
}
