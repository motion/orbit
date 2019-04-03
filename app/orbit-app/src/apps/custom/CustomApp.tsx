import { App, createApp } from '@o/kit'
import { Tab, Tabs } from '@o/ui'
import React from 'react'
import { CustomApp1 } from './CustomApp1'
import { CustomApp2 } from './CustomApp2'
import { CustomAppTree } from './CustomAppTree'

function CustomApp() {
  return (
    <App>
      <Tabs margin={[5, 0]}>
        <Tab id="0" label="Tree To Inspector">
          <CustomAppTree />
        </Tab>
        <Tab id="1" label="Panes with Tables">
          <CustomApp1 />
        </Tab>
        <Tab id="2" label="Multi-Step Flow">
          <CustomApp2 />
        </Tab>
      </Tabs>
    </App>
  )
}

export default createApp({
  id: 'custom2',
  name: 'Custom App Demos',
  icon: '',
  app: CustomApp,
})
