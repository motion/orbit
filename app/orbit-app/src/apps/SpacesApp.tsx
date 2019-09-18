import { useModels } from '@o/bridge'
import { App, AppViewProps, createApp, OrbitOrb, useActiveUser, useModel } from '@o/kit'
import { Space, SpaceModel } from '@o/models'
import { Button, CenteredText, Col, InputField, List, Paragraph, Row, Section, SimpleFormField, SubSection } from '@o/ui'
import randomColor from 'randomcolor'
import React from 'react'
import { useState } from 'react'

import { ColorPicker } from '../views/ColorPicker'

export default createApp({
  id: 'spaces',
  name: 'Spaces',
  icon: 'layer',
  app: props => (
    <App index={<SpacesAppIndex />}>
      <SpacesAppMain {...props} />
    </App>
  ),
})

function SpacesAppMain(props: AppViewProps) {
  if (props.subType === 'new-space') {
    return <SpacesAppNewSpace />
  }
  return <SpacesAppEdit id={+(props.id || 0)} />
}

function SpacesAppNewSpace() {
  const [newSpace] = useState<Space>({
    name: 'New Space',
    colors: ['red', 'orange'],
  })
  return (
    <Section title="Create new space" padding>
      <SpaceEdit space={newSpace} />
    </Section>
  )
}

function SpacesAppEdit({ id }: { id: number }) {
  const [space] = useModel(SpaceModel, { where: { id } })
  if (!space) {
    return <CenteredText>No space found for id {id}</CenteredText>
  }
  return (
    <Section titleBorder title={space.name}>
      <SpaceEdit space={space} />
    </Section>
  )
}

function SpacesAppIndex() {
  const [user, updateUser] = useActiveUser()
  const activeSpaceId = (user && user.activeSpace) || -1
  const [allSpaces] = useModels(SpaceModel, {})

  return (
    <List
      items={[
        ...allSpaces.map(space => ({
          id: `${space.id}`,
          subType: 'space',
          title: space.name,
          before: <OrbitOrb size={16} colors={space.colors} marginRight={12} />,
          height: 50,
          after: activeSpaceId === space.id && (
            <Button chromeless circular icon="tick" iconSize={12} />
          ),
          onOpen: () => {
            updateUser(user => {
              user.activeSpace = space.id
            })
          },
        })),
        {
          // group: 'Manage',
          id: 'new-space',
          title: 'New',
          subTitle: 'Create new space...',
          icon: 'add',
          iconBefore: true,
          iconProps: {
            size: 16,
          },
          subType: 'new-space',
        },
      ]}
    />
  )
}

const defaultColors = randomColor({ count: 2, luminosity: 'dark' })

export function SpaceEdit({ space }: { space: Space }) {
  const [colors, setColors] = useState(space.colors || defaultColors)

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
            coat={index === 0 ? 'selected' : null}
            icon={int.identifier}
            title={int.name}
          />
        ))}
      </SubSection> */}
    </>
  )
}
