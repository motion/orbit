import { useModel } from '@mcro/model-bridge'
import { AppModel } from '@mcro/models'
import { BorderBottom, Row } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { HorizontalSpace, SubTitle, Title } from '../../views'
import { FloatingBarButtonSmall } from '../../views/FloatingBar/FloatingBarButtonSmall'
import { OrbitListItemProps } from '../../views/ListItems/OrbitListItem'
import OrbitList from '../../views/Lists/OrbitList'
import { Section } from '../../views/Section'
import { AppSubView } from '../views/AppSubView'
import { loadListItem } from './helpers'
import { ListAppProps } from './ListsApp'
import { ListsAppBit } from './types'

export default React.memo(function ListsAppMain(props: ListAppProps) {
  if (!props.appConfig) {
    return null
  }
  if (props.appConfig.subType === 'folder') {
    return <ListsAppMainFolder {...props} />
  }
  return <AppSubView appConfig={props.appConfig} />
})

const ListsAppMainFolder = observer(function ListsAppMainFolder(props: ListAppProps) {
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
      <Row position="relative" alignItems="center" height={42}>
        {props.store.depth > 0 && (
          <>
            <FloatingBarButtonSmall icon="arrows-1_bold-left" onClick={props.store.back}>
              Back
            </FloatingBarButtonSmall>
            <HorizontalSpace />
          </>
        )}
        <Title marginBottom={4} ellipse>
          {props.appConfig.title}
        </Title>
        <BorderBottom />
      </Row>
      <OrbitList items={children} placeholder={<SubTitle>No items</SubTitle>} />
    </Section>
  )
})
