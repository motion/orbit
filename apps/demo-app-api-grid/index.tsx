import { AppCard, createApp, useUserState } from '@o/kit'
import Slack, { SlackConversation } from '@o/slack-app'
import { GridLayout, Tab, Table, Tabs } from '@o/ui'
import React, { useState } from 'react'

export default createApp({
  id: 'demo-app-api-grid',
  name: 'Demo App: API Grid',
  icon: 'grid',
  iconColors: ['rgb(46, 204, 64)', 'rgb(255, 65, 54)'],
  app: DemoGridApp,
})

export function DemoGridApp() {
  const [app, setApp] = useState(null)
  const [rooms, setRooms] = useState([])
  const [layout, setLayout] = useUserState('grid-layout', null)
  return (
    <GridLayout layout={layout} onChangeLayout={setLayout}>
      <AppCard key="slack" title="Slack Room 22222222  22" appType={Slack} onChange={setApp}>
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
