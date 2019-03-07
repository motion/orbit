import { AppProps } from '@o/kit'
import * as React from 'react'
import SpacesAppEdit from './SpacesAppEdit'
import { SpacesAppNewSpace } from './SpacesAppNewSpace'

export default function SpacesAppMain(props: AppProps) {
  if (!props.appConfig) return null

  if (props.appConfig.subType === 'new-space') {
    return <SpacesAppNewSpace {...props} />
  }

  return <SpacesAppEdit {...props} />
}
