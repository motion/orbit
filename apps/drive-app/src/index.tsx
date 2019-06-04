import { createApi, createApp } from '@o/kit'

import { graph } from './api.graph.node'
import { DriveApi } from './api.node'
import { DriveSettings } from './DriveSettings'
import { DriveSyncer } from './DriveSyncer'

export default createApp({
  id: 'drive',
  name: 'Drive',
  auth: 'drive',
  itemType: 'task',
  settings: DriveSettings,
  workers: [DriveSyncer],
  api: createApi(DriveApi),
  graph,
  icon: `
  <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512">
    <polygon style="fill:#28B446;" points="165.891,334.343 161.611,419.266 82.713,479.21 0,333.399 172.602,32.79 253.414,88.26
      256.078,178.175 255.315,178.614 "/>
    <polygon style="fill:#219B38;" points="172.602,32.79 221.718,237.124 256.078,178.175 253.414,59.814 "/>
    <polygon style="fill:#FFD837;" points="339.385,32.79 512,333.399 418.917,380.477 345.204,333.851 345.204,333.399
      256.078,178.175 172.602,32.79 "/>
    <polygon style="fill:#518EF8;" points="512,333.399 429.339,478.266 82.713,479.21 165.891,334.343 345.204,333.851 "/>
    <polygon style="fill:#3A5BBC;" points="82.713,479.21 227.749,334.173 165.891,334.343 "/>
    <polygon style="fill:#FBBB00;" points="512,333.399 322.76,294.31 345.204,333.851 "/>
  </svg>
  `,
})
