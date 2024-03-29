import { createApp } from '@o/kit'

import { graph } from './api.graph.node'
import SlackApi from './api.node'
import { SlackLoader } from './SlackLoader.node'
import { SlackSettings } from './SlackSettings'
import { SlackSyncerWorker } from './SlackSyncerWorker.node'

export * from 'slack'
export * from './SlackConversation'

export default createApp({
  id: 'slack',
  name: 'Slack',
  auth: 'slack',
  itemType: 'conversation',
  settings: SlackSettings,
  workers: [SlackSyncerWorker],
  finishAuth: async app => {
    const loader = new SlackLoader(app)
    const team = await loader.loadTeam()
    app.data.values.team = {
      id: team.id,
      name: team.name,
      domain: team.domain,
      icon: team.icon.image_132,
    }
    app.name = team.name
    return app
  },
  api: SlackApi,
  graph,
  iconColors: ['orange', 'yellow'],
  icon: `
<svg width="124px" height="124px" viewBox="0 0 124 124" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="slack">
      <g id="Group" transform="translate(0.000000, 65.000000)" fill="#E01E5A">
        <path d="M26.4,13.2 C26.4,20.3 20.6,26.1 13.5,26.1 C6.4,26.1 0.6,20.3 0.6,13.2 C0.6,6.1 6.4,0.3 13.5,0.3 L26.4,0.3 L26.4,13.2 Z" id="Path"></path>
        <path d="M32.9,13.2 C32.9,6.1 38.7,0.3 45.8,0.3 C52.9,0.3 58.7,6.1 58.7,13.2 L58.7,45.5 C58.7,52.6 52.9,58.4 45.8,58.4 C38.7,58.4 32.9,52.6 32.9,45.5 L32.9,13.2 Z" id="Path"></path>
      </g>
      <g id="Group" fill="#36C5F0">
        <path d="M45.8,26.4 C38.7,26.4 32.9,20.6 32.9,13.5 C32.9,6.4 38.7,0.6 45.8,0.6 C52.9,0.6 58.7,6.4 58.7,13.5 L58.7,26.4 L45.8,26.4 Z" id="Path"></path>
        <path d="M45.8,32.9 C52.9,32.9 58.7,38.7 58.7,45.8 C58.7,52.9 52.9,58.7 45.8,58.7 L13.5,58.7 C6.4,58.7 0.6,52.9 0.6,45.8 C0.6,38.7 6.4,32.9 13.5,32.9 L45.8,32.9 Z" id="Path"></path>
      </g>
      <g id="Group" transform="translate(65.000000, 0.000000)" fill="#2EB67D">
        <path d="M32.6,45.8 C32.6,38.7 38.4,32.9 45.5,32.9 C52.6,32.9 58.4,38.7 58.4,45.8 C58.4,52.9 52.6,58.7 45.5,58.7 L32.6,58.7 L32.6,45.8 Z" id="Path"></path>
        <path d="M26.1,45.8 C26.1,52.9 20.3,58.7 13.2,58.7 C6.1,58.7 0.3,52.9 0.3,45.8 L0.3,13.5 C0.3,6.4 6.1,0.6 13.2,0.6 C20.3,0.6 26.1,6.4 26.1,13.5 L26.1,45.8 Z" id="Path"></path>
      </g>
      <g id="Group" transform="translate(65.000000, 65.000000)" fill="#ECB22E">
        <path d="M13.2,32.6 C20.3,32.6 26.1,38.4 26.1,45.5 C26.1,52.6 20.3,58.4 13.2,58.4 C6.1,58.4 0.3,52.6 0.3,45.5 L0.3,32.6 L13.2,32.6 Z" id="Path"></path>
        <path d="M13.2,26.1 C6.1,26.1 0.3,20.3 0.3,13.2 C0.3,6.1 6.1,0.3 13.2,0.3 L45.5,0.3 C52.6,0.3 58.4,6.1 58.4,13.2 C58.4,20.3 52.6,26.1 45.5,26.1 L13.2,26.1 Z" id="Path"></path>
      </g>
    </g>
  </g>
</svg>
  `,
})
