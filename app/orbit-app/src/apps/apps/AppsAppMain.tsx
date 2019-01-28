import { Text, View } from '@mcro/ui'
import { capitalize } from 'lodash'
import * as React from 'react'
import { useActiveAppsSorted } from '../../hooks/useActiveAppsSorted'
import { RoundButton, Title } from '../../views'
import { Icon } from '../../views/Icon'
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
        items={results.map(x => (
          <View
            key={x.id}
            alignItems="center"
            justifyContent="center"
            width={60}
            height={60}
            margin={10}
          >
            <Icon size={32} name={x.icon} />
            <Text ellipse fontWeight={500} size={0.9}>
              {x.title}
            </Text>
          </View>
        ))}
      />
      {/* <OrbitList sortable items={results} /> */}
    </Section>
  )
}
