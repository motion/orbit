import { AppCard, createApp, useUserState } from '@o/kit'
import Slack, { SlackConversation } from '@o/slack-app'
import { GridLayout, Tab, Table, Tabs } from '@o/ui'
import React, { useState } from 'react'

/**
 * Demo app: Grid + API. Some notes:
 *
 *   1. You'll need to install the app `slack` via the app store so this can use it's API.
 *     - You can also install it with `orbit install slack`
 *
 */

/**
 * Your default export creates the app. Some notes:
 *
 *   1. See createApp type definitions for other features you cand define.
 *   2. See <App /> type definitions for more options on different app layouts.
 *   3. The `api`, `graph`, and `workers` options should all be in their own `.node.ts` files, they are node processes.
 *   4. Run `orbit dev` in this directory to start editing this app!
 */

export default createApp({
  id: '$ID',
  name: '$NAME',
  icon: '$ICON',
  iconColors: ['#111', '#222'],
  app: AppGrid,
})

export function AppGrid() {
  const [app, setApp] = useState(null)
  const [rooms, setRooms] = useState([])
  const [layout, setLayout] = useUserState('grid-layout', null)
  return (
    <GridLayout layout={layout} onChangeLayout={setLayout}>
      <AppCard key="slack" title="Slack Room" appType={Slack} onChange={setApp}>
        {({ api }) => {
          const res = api.channelsList()
          return (
            <Table
              shareable
              selectable="multi"
              items={(res && res.channels) || []}
              onSelect={x => setRooms(x)}
            />
          )
        }}
      </AppCard>
      <AppCard key="slack2" title="Room Messages" appType={Slack} app={app}>
        {({ api }) => (
          <Tabs scrollable defaultActive="0">
            {rooms.map((room, index) => (
              <Tab key={room.id} id={`${index}`} label={room.name} padding scrollable="y">
                {() => {
                  const res = api.channelsHistory({ channel: room.id })
                  return <SlackConversation messages={res.messages || []} />
                }}
              </Tab>
            ))}
          </Tabs>
        )}
      </AppCard>
    </GridLayout>
  )
}
