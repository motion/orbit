import { App, createApp } from '@o/kit'
import React from 'react'
import { cold } from 'react-hot-loader'

import { GraphExplorer, GraphQueryExplorer, useGraphExplorer } from '../views/GraphExplorer'

cold(GraphExplorer)

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
