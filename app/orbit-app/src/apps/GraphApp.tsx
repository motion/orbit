import { createApp, App } from '@o/kit'
import React from 'react'
import { useGraphExplorer, GraphExplorer, GraphQueryExplorer } from '../views/GraphExplorer'

export default createApp({
  id: 'graph',
  name: 'Graph',
  icon: 'graph',
  app: () => {
    const props = useGraphExplorer()
    return (
      <App index={<GraphExplorer {...props} />}>
        <GraphQueryExplorer {...props} />
      </App>
    )
  },
})
