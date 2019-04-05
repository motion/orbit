import { App, AppBit, createApp, SelectApp, Table } from '@o/kit'
import Slack from '@o/slack-app'
import { Card, GridItem, GridLayout } from '@o/ui'
import React, { useEffect, useState } from 'react'

function CustomApp() {
  const [app, setApp] = useState<AppBit>(null)
  const [res, setRes] = useState([])

  useEffect(() => {
    if (app) {
      Slack.api(app)
        .channelsList()
        .then(({ channels }) => {
          console.log('channels', channels)
          setRes(channels)
        })
    }
  }, [app])

  return (
    <App>
      <GridLayout>
        <GridItem w={4} h={4}>
          <Card
            afterTitle={<SelectApp onSelect={setApp} />}
            overflow="hidden"
            title="Slack Messages"
          >
            <Table rows={res} />
          </Card>
        </GridItem>
      </GridLayout>
    </App>
  )
}

export default createApp({
  id: 'custom',
  name: 'Custom',
  icon: '',
  app: CustomApp,
})
