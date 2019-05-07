import { OrbitOrb, useAppDefinitions, useAppsForSpace } from '@o/kit'
import { Space } from '@o/models'
import { Col, InputField, ListItem, Paragraph, Row, Section, SimpleFormField, Space as UISpace, SubSection } from '@o/ui'
import { pick } from 'lodash'
import randomColor from 'randomcolor'
import * as React from 'react'

import { HorizontalScroll } from '../../views'
import { ColorPicker } from '../../views/ColorPicker'
import { getApps } from '../orbitApps'

const defaultColors = randomColor({ count: 2, luminosity: 'dark' })
const appOrDefToDesc = x => pick(x, ['name', 'id', 'identifier'])

export function SpaceEdit({ space }: { space: Space }) {
  if (!space) return null
  const appDefs = getApps()

  // TODO x.auth check instead
  const apps = space.id
    ? useAppsForSpace(+space.id)
        .filter(app => {
          const def = appDefs.find(x => x.id === app.identifier)
          return def && !!def.sync
        })
        .map(appOrDefToDesc)
    : useAppDefinitions()
        .filter(x => !!x.sync)
        .map(appOrDefToDesc)
  const [colors, setColors] = React.useState(space.colors || defaultColors)

  return (
    <Section titleBorder pad="xl" title={space.name}>
      <SubSection title="General">
        <Paragraph>Customize your space appearance.</Paragraph>

        <InputField
          label="Name"
          placeholder="Name..."
          onChange={e => {
            console.log('change name', e)
            // update name...
          }}
        />

        <SimpleFormField label="Theme">
          <Row alignItems="center" overflow="hidden" flex={1}>
            <OrbitOrb size={48} colors={colors} />
            <UISpace />
            <Col flex={1}>
              <HorizontalScroll height={30}>
                <ColorPicker
                  count={50}
                  activeColor={colors[0]}
                  onChangeColor={x => setColors([x, colors[1]])}
                />
              </HorizontalScroll>
              <UISpace size="sm" />
              <HorizontalScroll height={30}>
                <ColorPicker
                  count={50}
                  activeColor={colors[1]}
                  onChangeColor={x => setColors([colors[0], x])}
                />
              </HorizontalScroll>
            </Col>
          </Row>
        </SimpleFormField>
      </SubSection>

      <UISpace />

      <SubSection title="Authentication">
        <Paragraph>Choose which source grants access to this space.</Paragraph>

        {(apps || []).map((int, index) => (
          <ListItem
            key={int.id}
            alt={index === 0 ? 'selected' : null}
            icon={int.identifier}
            title={int.name}
          />
        ))}
      </SubSection>
    </Section>
  )
}
