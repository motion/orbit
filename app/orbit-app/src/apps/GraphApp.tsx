import { createApp } from '@o/kit'
import React from 'react'

export default createApp({
  id: 'graph',
  name: 'Graph',
  icon: 'graph',
  app: () => {
    return null
    // const props = useGraphExplorer()
    // return (
    //   <App index={<GraphExplorer {...props} />}>
    //     <GraphQueryExplorer {...props} />
    //   </App>
    // )
  },
})
