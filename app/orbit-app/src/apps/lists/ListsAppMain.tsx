import { useObserveMany } from '@mcro/model-bridge'
import { AppType, BitModel } from '@mcro/models'
import * as React from 'react'
import { SubTitle, Title } from '../../views'
import OrbitList from '../../views/Lists/OrbitList'
import { Section } from '../../views/Section'
import { AppProps } from '../AppProps'

export const ListsAppMain = React.memo(function ListsAppMain(props: AppProps<AppType.lists>) {
  const items = useObserveMany(BitModel, {
    where: {},
    take: 10,
  })
  return (
    <Section>
      <Title>{props.appConfig && props.appConfig.title}</Title>
      <OrbitList items={items} placeholder={<SubTitle>No items</SubTitle>} />
    </Section>
  )
})
