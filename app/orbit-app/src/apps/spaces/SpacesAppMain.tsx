import { AppMainProps } from '@o/kit'
import * as React from 'react'
import SpacesAppEdit from './SpacesAppEdit'
import { SpacesAppNewSpace } from './SpacesAppNewSpace'

export default function SpacesAppMain(props: AppMainProps) {
  if (props.subType === 'new-space') {
    return <SpacesAppNewSpace {...props} />
  }

  return <SpacesAppEdit {...props} />
}
