import { useObserveOne } from '@mcro/model-bridge'
import { AppModel, AppType, ListsApp } from '@mcro/models'
import * as React from 'react'
import { SubTitle, Title } from '../../views'
import { OrbitListItemProps } from '../../views/ListItems/OrbitListItem'
import OrbitList from '../../views/Lists/OrbitList'
import { Message } from '../../views/Message'
import { Section } from '../../views/Section'
import { AppProps } from '../AppProps'
import { AppSubView } from '../views/AppSubView'
import { loadListItem } from './ListsAppIndex'

type ListAppProps = AppProps<AppType.lists>

export const ListsAppMain = React.memo(function ListsAppMain(props: ListAppProps) {
  if (!props.appConfig) {
    return null
  }
  if (props.appConfig.subType === 'folder') {
    return <ListsAppMainFolder {...props} />
  }
  return <AppSubView appConfig={props.appConfig} />
})

function ListsAppMainFolder(props: ListAppProps) {
  const list = useObserveOne(AppModel, { where: { id: +props.appConfig.id } }) as ListsApp
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

  if (!selectedItem) {
    return <Message>Not found!</Message>
  }

  return (
    <Section>
      <Title>{props.appConfig.title}</Title>
      <OrbitList items={children} placeholder={<SubTitle>No items</SubTitle>} />
    </Section>
  )
}
