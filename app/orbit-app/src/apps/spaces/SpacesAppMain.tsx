import { AppViewProps } from '@o/kit'
import * as React from 'react'
import SpacesAppEdit from './SpacesAppEdit'
import { SpacesAppNewSpace } from './SpacesAppNewSpace'

export default function SpacesAppMain(props: AppViewProps) {
  if (props.subType === 'new-space') {
    return <SpacesAppNewSpace />
  }

  return <SpacesAppEdit {...props} />
}
