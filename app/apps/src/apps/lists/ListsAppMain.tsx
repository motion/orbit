import { AppMainProps, AppMainView } from '@o/kit'
import { Title } from '@o/ui'
import * as React from 'react'

export function ListsAppMain(props: AppMainProps) {
  return null
  if (props.subType === 'folder') {
    return null
    // return <ListsAppMainFolder {...props} />
  }
  return (
    <>
      <ListAppTitle />
      <AppMainView {...props} />
    </>
  )
}

function ListAppTitle(props) {
  return null
  return (
    // !TODO merge TitleRow into Title so we have bordered/padded
    <Title bordered sizePadding={2} margin={0} {...props}>
      {(listStore.app && listStore.app.name) || 'No Title'}
    </Title>
  )
}

// function ListsAppMainFolder(/* props: AppMainProps */) {
// @ts-ignore
// const { listStore } = useStores()
// const [list] = useModel(AppModel, { where: { id: +props.id } }) as [ListsAppBit, any]
// const selectedItem = list && list.data.items[+props.subId]
// const [children, setChildren] = React.useState<OrbitListItemProps[]>([])

// React.useEffect(
//   () => {
//     if (selectedItem && selectedItem.type === 'folder') {
//       Promise.all(
//         selectedItem.children.map(id => {
//           return loadListItem(list.data.items[id])
//         }),
//       ).then(items => {
//         setChildren(items)
//       })
//     }
//   },
//   [selectedItem && selectedItem.id],
// )
// return (
//   <>
//     <ListAppTitle
//       before={
//         listStore.depth > 0 && (
//           <BarButtonSmall icon="arrows-1_bold-left" onClick={listStore.back}>
//             Back
//           </BarButtonSmall>
//         )
//       }
//     >
//       {props.appConfig.title}
//     </ListAppTitle>
//     <List
//       items={children}
//       placeholder={
//         <View flex={1} alignItems="center" justifyContent="center">
//           <SubTitle>No items</SubTitle>
//         </View>
//       }
//     />
//   </>
// )
// }
