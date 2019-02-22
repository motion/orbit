import { useModel } from '@mcro/bridge'
import { OrbitOrb } from '@mcro/kit'
import { SpaceModel } from '@mcro/models'
import {
  Col,
  FormRow,
  HorizontalSpace,
  InputRow,
  ListItem,
  Row,
  Section,
  SubTitle,
  Text,
  Theme,
  Title,
  VerticalSpace,
} from '@mcro/ui'
import randomColor from 'randomcolor'
import * as React from 'react'
import { useSourcesForSpace } from '../../hooks/useSourcesForSpace'
import { HorizontalScroll } from '../../views'
import { ColorPicker } from '../../views/ColorPicker'
import { SubSection } from '../../views/SubSection'
import { AppProps } from '../AppTypes'

const defaultColors = randomColor({ count: 2, luminosity: 'dark' })

export default function SpacesAppEdit(props: AppProps) {
  const id = +props.appConfig.id
  const [space] = useModel(SpaceModel, { where: { id } })
  const sources = useSourcesForSpace({ spaceId: id })
  const [colors, setColors] = React.useState(defaultColors)

  return (
    <Section>
      <SubTitle>Space</SubTitle>
      <Title>{props.appConfig.title}</Title>

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
        <Text size={1.1}>Choose which source grants access to this space.</Text>
        <VerticalSpace />

        {(sources || []).map((int, index) => (
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
}
