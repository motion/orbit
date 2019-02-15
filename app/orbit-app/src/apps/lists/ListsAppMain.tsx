import { AppModel } from '@mcro/models'
import * as React from 'react'
import { useStores } from '../../hooks/useStores'
import { useModel } from '../../useModel'
import { SubTitle } from '../../views'
import { FloatingBarButtonSmall } from '../../views/FloatingBar/FloatingBarButtonSmall'
import { OrbitListItemProps } from '../../views/ListItems/OrbitListItem'
import OrbitList from '../../views/Lists/OrbitList'
import { Section } from '../../views/Section'
import { TitleRow } from '../../views/TitleRow'
import { AppProps } from '../AppTypes'
import { AppSubView } from '../views/AppSubView'
import { loadListItem } from './helpers'
import { ListsAppBit } from './types'

export default React.memo(function ListsAppMain(props: AppProps) {
  if (!props.appConfig) {
    return null
  }
  if (props.appConfig.subType === 'folder') {
    return <ListsAppMainFolder {...props} />
  }
  return <AppSubView appConfig={props.appConfig} />
})

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
    <Section>
      <TitleRow
        bordered
        before={
          listStore.depth > 0 && (
            <FloatingBarButtonSmall icon="arrows-1_bold-left" onClick={listStore.back}>
              Back
            </FloatingBarButtonSmall>
          )
        }
      >
        {props.appConfig.title}
      </TitleRow>
      <OrbitList items={children} placeholder={<SubTitle>No items</SubTitle>} />
    </Section>
  )
}
