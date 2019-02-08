import React from 'react';
import { AppContainer } from '../AppContainer';
import { AppProps } from '../AppTypes';
import { OrbitSettingsToolbar } from '../views/OrbitSettingsToolbar';
import SourcesAppIndex from './SourcesAppIndex';
import { SourcesAppMain } from './SourcesAppMain';

export function SourcesApp(props: AppProps) {
  return (
    <AppContainer index={<SourcesAppIndex {...props} />} toolBar={<OrbitSettingsToolbar />}>
      <SourcesAppMain {...props} />
    </AppContainer>
  )
}
