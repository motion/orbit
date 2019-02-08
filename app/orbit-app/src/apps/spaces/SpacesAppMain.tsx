import { useModel } from '@mcro/model-bridge'
import { SpaceModel } from '@mcro/models'
import { Col, Row, Text, Theme } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import randomColor from 'randomcolor'
import * as React from 'react'
import { useIntegrationsForSpace } from '../../hooks/useIntegrationsForSpace'
import {
  FormRow,
  HorizontalScroll,
  HorizontalSpace,
  InputRow,
  SubTitle,
  Title,
  VerticalSpace,
} from '../../views'
import { ColorPicker } from '../../views/ColorPicker'
import ListItem from '../../views/ListItems/ListItem'
import { OrbitOrb } from '../../views/OrbitOrb'
import { Section } from '../../views/Section'
import { SubSection } from '../../views/SubSection'
import { AppProps } from '../AppTypes'

const defaultColors = randomColor({ count: 2, luminosity: 'dark' })

export default observer(function SpacesAppMain({ appConfig }: AppProps) {
  if (!appConfig) {
    return null
  }

  const id = +appConfig.id
  const [space] = useModel(SpaceModel, { where: { id } })
  const integrations = useIntegrationsForSpace({ spaceId: id })
  const [colors, setColors] = React.useState(defaultColors)

  return (
    <Section>
      <SubTitle>Space</SubTitle>
      <Title>{appConfig.title}</Title>

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

        <FormRow label="Theme">
          <Row alignItems="center" overflow="hidden" flex={1}>
            <OrbitOrb size={48} colors={colors} />
            <HorizontalSpace />
            <Col flex={1}>
              <HorizontalScroll height={30}>
                <ColorPicker
                  count={50}
                  activeColor={colors[0]}
                  onChangeColor={x => setColors([x, colors[1]])}
                />
              </HorizontalScroll>
              <VerticalSpace small />
              <HorizontalScroll height={30}>
                <ColorPicker
                  count={50}
                  activeColor={colors[1]}
                  onChangeColor={x => setColors([colors[0], x])}
                />
              </HorizontalScroll>
            </Col>
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
