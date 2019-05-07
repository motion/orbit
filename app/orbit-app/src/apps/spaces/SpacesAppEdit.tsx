import { useModel } from '@o/bridge'
import { AppProps } from '@o/kit'
import { SpaceModel } from '@o/models'
import * as React from 'react'

import { SpaceEdit } from './SpaceEdit'

export default function SpacesAppEdit(props: AppProps) {
  const id = +props.id
  const [space] = useModel(SpaceModel, { where: { id } })

  return (
    <>
      <SpaceEdit space={space} />
    </>
  )
}
