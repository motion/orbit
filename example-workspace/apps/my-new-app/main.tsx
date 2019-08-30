import { App, createApp } from '@o/kit'
import { Title } from '@o/ui'
import React from 'react'

/**
 * Your default export creates the app. Some notes:
 *
 *   1. See createApp type definitions for other features you can define.
 *   2. See <App /> type definitions for more options on different app layouts.
 *   3. The `api`, `graph`, and `workers` options should all be in their own `.node.ts` files, they are node processes.
 *   4. Run `orbit dev` in this directory to start editing this app!
 */

export default createApp({
  id: 'my-new-app',
  name: 'my-new-app',
  icon: 'blank',
  iconColors: ['#111', '#222'],
  app: () => (
    <App>
      <AppMain />
    </App>
  ),
})

function AppMain() {
  return <Title>Hello World good da oky??</Title>
}
