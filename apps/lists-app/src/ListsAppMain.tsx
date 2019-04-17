import { AppMainView, AppProps, OrbitListItemProps, useTreeList } from '@o/kit'
import { List, TitleRow, TitleRowProps } from '@o/ui'
import * as React from 'react'

export function ListsAppMain(props: AppProps) {
  if (props.subType === 'folder') {
    return <ListsAppMainFolder {...props} />
  }
  return (
    <>
      <ListAppTitle title={props.title || 'hi'} />
      <AppMainView {...props} />
    </>
  )
}

function ListAppTitle(props: TitleRowProps) {
  return <TitleRow bordered sizePadding={2} margin={0} {...props} />
}

function ListsAppMainFolder(props: AppProps) {
  const treeList = useTreeList('list')
  const selectedItem = treeList.userState.currentFolder[+props.subId]
  const [children, setChildren] = React.useState<OrbitListItemProps[]>([])

  React.useEffect(() => {
    if (selectedItem && selectedItem.type === 'folder') {
      Promise.all(
        selectedItem.children.map(id => {
          return { id }
          // return loadListItem(list.data.items[id])
        }),
      ).then(items => {
        setChildren(items)
      })
    }
  }, [selectedItem && selectedItem.id])

  // treeList.userState.depth > 0 && (
  //   <Button icon="checkron-left" onClick={treeList.actions.back}>
  //     Back
  //   </Button>
  // )
  return <List title={props.title} items={children} />
}
