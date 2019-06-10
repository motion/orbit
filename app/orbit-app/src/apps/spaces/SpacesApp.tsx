import { App, AppViewProps, createApp, useModel } from '@o/kit'
import { SpaceModel } from '@o/models'
import { Section } from '@o/ui'
import React from 'react'

import { OrbitSettingsToolbar } from '../views/OrbitSettingsToolbar'
import { SpaceEdit } from './SpaceEdit'
import SpacesAppIndex from './SpacesAppIndex'
import { SpacesAppNewSpace } from './SpacesAppNewSpace'

export default createApp({
  id: 'spaces',
  name: 'Spaces',
  icon: '',
  app: props => (
    <App index={<SpacesAppIndex />} toolBar={<OrbitSettingsToolbar />}>
      <SpacesAppMain {...props} />
    </App>
  ),
})

function SpacesAppMain(props: AppViewProps) {
  if (props.subType === 'new-space') {
    return <SpacesAppNewSpace />
  }
  return <SpacesAppEdit id={+props.id} />
}

export function SpacesAppEdit({ id }: { id: number }) {
  const [space] = useModel(SpaceModel, { where: { id } })
  return (
    <Section titleBorder title={space.name}>
      <SpaceEdit id={id} />
    </Section>
  )
}
