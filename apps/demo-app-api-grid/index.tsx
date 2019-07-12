import { AppCard, createApp } from '@o/kit'
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
  return (
    <GridLayout>
      <AppCard key="slack" title="Slack Room" appType={Slack} onChange={setApp}>
        {({ api }) => {
          const res = api.channelsList()
          console.log('re render table', res, api)
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
          <Tabs>
            {rooms.map(room => (
              <Tab key={room.id} label={room.name} padding>
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
