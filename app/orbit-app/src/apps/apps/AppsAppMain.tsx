import { Button, View } from '@mcro/ui'
import { capitalize } from 'lodash'
import * as React from 'react'
import { useActiveAppsSorted } from '../../hooks/useActiveAppsSorted'
import { RoundButton, Title } from '../../views'
import OrbitList from '../../views/Lists/OrbitList'
import { Section } from '../../views/Section'
import { SortableGrid } from '../../views/SortableGrid'

export default function AppsAppMain() {
  const activeApps = useActiveAppsSorted()
  const activeItems = activeApps.map(x => ({
    id: x.id,
    title: x.name,
    icon: `orbit${capitalize(x.type)}`,
    type: 'installed',
    group: 'Installed Apps',
    after: <RoundButton circular icon="remove" />,
  }))
  const results = [...activeItems]

  return (
    <Section sizePadding={2}>
      <Title>Apps</Title>
      <SortableGrid
        maxWidth={400}
        margin="auto"
        items={[
          ...[1, 2, 3, 4, 5, 6, 7, 8].map(x => (
            <View>
              <Button icon="hi" size={2} /> test 123 {x}
            </View>
          )),
        ]}
      />
      <OrbitList sortable items={results} />
    </Section>
  )
}
