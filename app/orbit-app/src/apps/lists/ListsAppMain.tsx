import { AppType, BitModel } from '@mcro/models'
import * as React from 'react'
import { Title } from '../../views'
import SelectableList from '../../views/Lists/SelectableList'
import { Section } from '../../views/Section'
import { AppProps } from '../AppProps'
import { useModels } from '@mcro/model-bridge'

export const ListsAppMain = React.memo(function ListsAppMain(props: AppProps<AppType.lists>) {
  const [items] = useModels(BitModel, {
    where: {},
    take: 10,
  })
  return (
    <Section>
      <Title>{props.appConfig && props.appConfig.title}</Title>
      <SelectableList items={items} />
    </Section>
  )
})
