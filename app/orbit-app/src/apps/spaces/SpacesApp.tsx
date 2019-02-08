import React from 'react';
import { AppContainer } from '../AppContainer';
import { AppProps } from '../AppTypes';
import { OrbitSettingsToolbar } from '../views/OrbitSettingsToolbar';
import SpacesAppIndex from './SpacesAppIndex';
import SpacesAppMain from './SpacesAppMain';

export function SpacesApp(props: AppProps) {
  return (
    <AppContainer index={<SpacesAppIndex />} toolBar={<OrbitSettingsToolbar />}>
      <SpacesAppMain {...props} />
    </AppContainer>
  )
}
