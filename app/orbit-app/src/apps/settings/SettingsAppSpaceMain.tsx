import { useObserveOne } from '@mcro/model-bridge'
import { AppType, SpaceModel } from '@mcro/models'
import { Row, Text, Theme } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntegrationsForSpace } from '../../hooks/useIntegrationsForSpace'
import { FormRow, InputRow, Title, VerticalSpace } from '../../views'
import { ColorPicker } from '../../views/ColorPicker'
import ListItem from '../../views/ListItems/ListItem'
import { Section } from '../../views/Section'
import { SubSection } from '../../views/SubSection'
import { AppProps } from '../AppProps'

export default observer(function SettingsAppSpaces({ appConfig }: AppProps<AppType.settings>) {
  const id = +appConfig.id
  const space = useObserveOne(SpaceModel, { where: { id } })
  const integrations = useIntegrationsForSpace({ spaceId: id })

  return (
    <Section sizePadding={2}>
      <Title>Manage space: {appConfig.title}</Title>

      <SubSection title="General">
        <Text size={1.1}>Customize your space appearance.</Text>
        <VerticalSpace />

        <InputRow
          label="Name"
          placeholder="Name..."
          onChange={e => {
            // update name...
          }}
        />

        <FormRow label="Color">
          <Row>
            <ColorPicker />
          </Row>
        </FormRow>
      </SubSection>

      <VerticalSpace />

      <SubSection title="Authentication">
        <Text size={1.1}>Choose which integration grants access to this space.</Text>
        <VerticalSpace />

        {(integrations || []).map((int, index) => (
          <Theme key={int.id} name={index === 0 ? 'selected' : null}>
            <ListItem icon={int.type} title={int.name} />
          </Theme>
        ))}
      </SubSection>

      <SubSection title="Members">
        <Text size={1.1}>View and manage memebers who have joined this space.</Text>
        <VerticalSpace />
      </SubSection>

      {JSON.stringify(space)}
    </Section>
  )
})
