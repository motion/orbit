import { useModel } from '@o/bridge'
import { AppProps, OrbitOrb, useAppsForSpace } from '@o/kit'
import { SpaceModel } from '@o/models'
import {
  Col,
  FormField,
  HorizontalSpace,
  InputField,
  ListItem,
  Row,
  Section,
  SubTitle,
  Text,
  Theme,
  Title,
  VerticalSpace,
} from '@o/ui'
import randomColor from 'randomcolor'
import * as React from 'react'
import { HorizontalScroll } from '../../views'
import { ColorPicker } from '../../views/ColorPicker'
import { SubSection } from '../../views/SubSection'

const defaultColors = randomColor({ count: 2, luminosity: 'dark' })

export default function SpacesAppEdit(props: AppProps) {
  const id = +props.id
  const [space] = useModel(SpaceModel, { where: { id } })
  const apps = useAppsForSpace(id)
  const [colors, setColors] = React.useState(defaultColors)

  return (
    <Section>
      <SubTitle>Space</SubTitle>
      <Title>{props.title}</Title>

      <SubSection title="General">
        <Text size={1.1}>Customize your space appearance.</Text>
        <VerticalSpace />

        <InputField
          label="Name"
          placeholder="Name..."
          onChange={e => {
            console.log('change name', e)
            // update name...
          }}
        />

        <FormField label="Theme">
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
        </FormField>
      </SubSection>

      <VerticalSpace />

      <SubSection title="Authentication">
        <Text size={1.1}>Choose which source grants access to this space.</Text>
        <VerticalSpace />

        {(apps || []).map((int, index) => (
          <Theme key={int.id} name={index === 0 ? 'selected' : null}>
            <ListItem icon={int.identifier} title={int.name} />
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
}
