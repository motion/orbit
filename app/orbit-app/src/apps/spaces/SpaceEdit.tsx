import { OrbitOrb, useModel } from '@o/kit'
import { SpaceModel } from '@o/models'
import { Col, InputField, Paragraph, Row, SimpleFormField, SubSection } from '@o/ui'
import randomColor from 'randomcolor'
import * as React from 'react'

import { ColorPicker } from '../../views/ColorPicker'

const defaultColors = randomColor({ count: 2, luminosity: 'dark' })

export function SpaceEdit({ id }: { id: number }) {
  const [space] = useModel(SpaceModel, { where: { id } })
  // const appDefs = getApps()
  const [colors, setColors] = React.useState(space.colors || defaultColors)

  if (!space) {
    return null
  }

  return (
    <>
      <SubSection space title="General">
        <Paragraph>Customize your space appearance.</Paragraph>

        <InputField
          size="xxl"
          label="Name"
          placeholder="Name..."
          defaultValue={space.name}
          onChange={e => {
            console.log('change name', e)
            // update name...
          }}
        />

        <SimpleFormField label="Theme">
          <Row alignItems="center" space>
            <OrbitOrb size={48} colors={colors} />
            <Col flex={1}>
              <ColorPicker
                count={50}
                activeColor={colors[0]}
                onChangeColor={x => setColors([x, colors[1]])}
              />
            </Col>
          </Row>
        </SimpleFormField>
      </SubSection>

      {/* <SubSection space title="Authentication">
        <Paragraph>Choose which source grants access to this space.</Paragraph>

        {[].map((int, index) => (
          <ListItem
            key={int.id}
            alt={index === 0 ? 'selected' : null}
            icon={int.identifier}
            title={int.name}
          />
        ))}
      </SubSection> */}
    </>
  )
}
