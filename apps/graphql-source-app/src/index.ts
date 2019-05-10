import { createApp } from '@o/kit'

import { graph } from './graph.node'
import { graphQLIcon } from './graphqlIcon.ts'

export default createApp({
  id: 'graphQL',
  name: 'GraphQL',
  icon: graphQLIcon,
  graph,
  setup: {
    url: {
      name: 'URL',
      required: true,
      defaultValue: 'https://api.graphcms.com/simple/v1/swapi',
    },
    headers: {
      name: 'Headers',
      type: 'object',
    },
  },
})
