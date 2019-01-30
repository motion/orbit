import { useObserveOne } from '@mcro/model-bridge'
import { AppType, SpaceModel } from '@mcro/models'
import { Row, Text, Theme, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntegrationsForSpace } from '../../hooks/useIntegrationsForSpace'
import { FormRow, InputRow, Title, VerticalSpace } from '../../views'
import { Icon } from '../../views/Icon'
import { IconContainer } from '../../views/IconContainer'
import ListItem from '../../views/ListItems/ListItem'
import { Section } from '../../views/Section'
import { SubSection } from '../../views/SubSection'
import { AppProps } from '../AppProps'
import { useModel } from '@mcro/model-bridge'

export default observer(function SettingsAppSpaces({ appConfig }: AppProps<AppType.settings>) {
  const id = +appConfig.id
  const [space] = useModel(SpaceModel, { where: { id } })
  const integrations = useIntegrationsForSpace({ spaceId: id })

  console.log('integrations, integrations', integrations)

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
            //
          }}
        />

        <FormRow label="Color">
          <Row>
            {[1, 2, 3].map((app, index) => (
              <View key={index} alignItems="center" marginRight={12}>
                <Theme name={index === 0 ? 'selected' : null}>
                  <IconContainer onClick={() => {}}>
                    <Icon name="orbitPeople" />
                  </IconContainer>
                </Theme>
                <Text marginTop={5} ellipse size={0.9} fontWeight={500} alpha={0.8}>
                  hello world
                </Text>
              </View>
            ))}
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
