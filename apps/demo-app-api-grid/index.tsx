import { AppCard, createApp, useUserState } from '@o/kit'
import Slack, { SlackConversation } from '@o/slack-app'
import { Calendar, Card, GridLayout, Tab, Table, Tabs } from '@o/ui'
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
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: null,
    key: 'selection',
  })
  console.log('dateRange', dateRange)
  return (
    <GridLayout layout={layout} onChangeLayout={setLayout}>
      <AppCard key="slack" title="Slack room" appType={Slack} onChange={setApp}>
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
      <Card flex={1} elevation={3} key="slack2" title="Time Period" padding="sm">
        <Calendar
          ranges={[dateRange]}
          scroll={{ enabled: true }}
          showSelectionPreview={false}
          showDateDisplay={false}
          moveRangeOnFirstSelection={false}
          onChange={(a, b) => {
            setDateRange([a])
            console.log('a', a, b)
          }}
        />
      </Card>
      <AppCard key="slack3" title="Room Messages" appType={Slack} app={app} padding="sm">
        {({ api }) => (
          <Tabs scrollable defaultActive="0">
            {rooms.map((room, index) => (
              <Tab key={room.id} id={`${index}`} label={room.name} padding="sm" scrollable="y">
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
