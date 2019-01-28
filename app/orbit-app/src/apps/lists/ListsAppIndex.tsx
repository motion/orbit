import { loadOne, useModel, useObserveMany } from '@mcro/model-bridge'
import { AppModel, AppType, BitModel, ListsAppData, PersonBitModel } from '@mcro/models'
import { Button } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import OrbitFloatingBar from '../../components/OrbitFloatingBar'
import { OrbitToolbar } from '../../components/OrbitToolbar'
import { Breadcrumb, Breadcrumbs } from '../../views/Breadcrumbs'
import { SelectableTreeList } from '../../views/Lists/SelectableTreeList'
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

  if (testItems.length < 10) {
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

  return (
    <>
      <OrbitToolbar />
      {/* <OrbitToolbar>
        <ListAppBreadcrumbs />
      </OrbitToolbar>
      <ListAppBreadcrumbs /> */}

      <SelectableTreeList
        minSelected={0}
        rootItemID={0}
        items={items}
        onLoadItem={async item => {
          switch (item.type) {
            case 'folder':
              return {
                title: item.name,
                subtitle: `${item.children.length} items`,
                after: <Button circular chromeless size={0.9} icon="arrowright" />,
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
        }}
        sortable
        getContextMenu={index => {
          return [
            {
              label: 'Delete',
              click: () => {
                console.log('delete item')
              },
            },
          ]
        }}
      />

      <OrbitFloatingBar showSearch>
        <ListEdit />
      </OrbitFloatingBar>
    </>
  )
})

function ListAppBreadcrumbs() {
  return (
    <Breadcrumbs>
      <Breadcrumb>Memory</Breadcrumb>
      <Breadcrumb>Memory</Breadcrumb>
      <Breadcrumb>Memory</Breadcrumb>
    </Breadcrumbs>
  )
}
