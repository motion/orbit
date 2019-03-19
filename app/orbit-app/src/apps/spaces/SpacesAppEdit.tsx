import { useModel } from '@o/bridge'
import { AppProps } from '@o/kit'
import { SpaceModel } from '@o/models'
import { Section, Space, Text } from '@o/ui'
import * as React from 'react'
import { SubSection } from '../../views/SubSection'
import { SpaceEdit } from './SpaceEdit'

export default function SpacesAppEdit(props: AppProps) {
  const id = +props.id
  const [space] = useModel(SpaceModel, { where: { id } })

  return (
    <Section>
      <SpaceEdit space={space} />

      <SubSection title="Members">
        <Text size={1.1}>View and manage memebers who have joined this space.</Text>
        <Space />
      </SubSection>

      {JSON.stringify(space)}
    </Section>
  )
}
