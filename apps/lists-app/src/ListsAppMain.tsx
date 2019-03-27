import { AppMainView, AppProps, List, OrbitListItemProps, useTreeList } from '@o/kit'
import { BarButtonSmall, TitleRow, TitleRowProps } from '@o/ui'
import * as React from 'react'

export function ListsAppMain(props: AppProps) {
  return null
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

  React.useEffect(
    () => {
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
    },
    [selectedItem && selectedItem.id],
  )

  return (
    <>
      <ListAppTitle
        title={props.title}
        before={
          treeList.userState.depth > 0 && (
            <BarButtonSmall icon="arrows-1_bold-left" onClick={treeList.actions.back}>
              Back
            </BarButtonSmall>
          )
        }
      />
      <List items={children} />
    </>
  )
}
