import React from 'react'
import { App } from '../App'
import { AppProps } from '../AppTypes'
import { OrbitSettingsToolbar } from '../views/OrbitSettingsToolbar'
import SourcesAppIndex from './SourcesAppIndex'
import { SourcesAppMain } from './SourcesAppMain'

export function SourcesApp(props: AppProps) {
  return (
    <App index={<SourcesAppIndex {...props} />} toolBar={<OrbitSettingsToolbar />}>
      <SourcesAppMain {...props} />
    </App>
  )
}
