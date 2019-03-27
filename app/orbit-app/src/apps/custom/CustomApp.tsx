import { App, createApp } from '@o/kit'
import { Tab, Tabs } from '@o/ui'
import React from 'react'
import { CustomApp1 } from './CustomApp1'
import { CustomApp2 } from './CustomApp2'

function CustomApp() {
  return (
    <App>
      <Tabs>
        <Tab id="0" label="Demo 1">
          <CustomApp1 />
        </Tab>
        <Tab id="1" label="Demo 2">
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
