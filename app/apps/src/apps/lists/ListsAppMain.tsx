import { useModel } from '@mcro/bridge'
import { AppProps, AppSubView, List, OrbitListItemProps } from '@mcro/kit'
import { AppModel } from '@mcro/models'
import { BarButtonSmall, SubTitle, Title, View } from '@mcro/ui'
import * as React from 'react'
import { useStores } from '../../hooks/useStores'
import { loadListItem } from './helpers'
import { ListsAppBit } from './types'

export function ListsAppMain(props: AppProps) {
  if (!props.appConfig) {
    return null
  }
  if (props.appConfig.subType === 'folder') {
    return <ListsAppMainFolder {...props} />
  }
  return (
    <>
      <ListAppTitle />
      <AppSubView appConfig={props.appConfig} />
    </>
  )
}

function ListAppTitle(props) {
  // @ts-ignore
  const { listStore } = useStores()
  return (
    // !TODO merge TitleRow into Title so we have bordered/padded
    <Title bordered sizePadding={2} margin={0} {...props}>
      {(listStore.app && listStore.app.title) || 'No Title'}
    </Title>
  )
}

function ListsAppMainFolder(props: AppProps) {
  // @ts-ignore
  const { listStore } = useStores()
  const [list] = useModel(AppModel, { where: { id: +props.appConfig.id } }) as [ListsAppBit, any]
  const selectedItem = list && list.data.items[+props.appConfig.subId]
  const [children, setChildren] = React.useState<OrbitListItemProps[]>([])

  React.useEffect(
    () => {
      if (selectedItem && selectedItem.type === 'folder') {
        Promise.all(
          selectedItem.children.map(id => {
            return loadListItem(list.data.items[id])
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
        before={
          listStore.depth > 0 && (
            <BarButtonSmall icon="arrows-1_bold-left" onClick={listStore.back}>
              Back
            </BarButtonSmall>
          )
        }
      >
        {props.appConfig.title}
      </ListAppTitle>
      <List
        items={children}
        placeholder={
          <View flex={1} alignItems="center" justifyContent="center">
            <SubTitle>No items</SubTitle>
          </View>
        }
      />
    </>
  )
}
