import { createApi, createApp } from '@o/kit'

import { graph } from './api.graph.node'
import { JiraApi } from './api.node'
import { JiraLoader } from './JiraLoader'
import { JiraAppData } from './JiraModels'
import { JiraSyncer } from './JiraSyncer.node'
import { Syncer } from '@o/worker-kit'

export default createApp<JiraAppData>({
  id: 'jira',
  name: 'Jira',
  icon: `
  <svg width="108px" height="108px" viewBox="0 0 108 108">
      <defs>
          <linearGradient x1="98.0308675%" y1="0.160599572%" x2="58.8877062%" y2="40.7655246%" id="linearGradient-1">
              <stop stop-color="#0052CC" offset="18%"></stop>
              <stop stop-color="#2684FF" offset="100%"></stop>
          </linearGradient>
          <linearGradient x1="3739.42064%" y1="3462%" x2="2058.27826%" y2="5116%" id="linearGradient-2">
              <stop stop-color="#0052CC" offset="18%"></stop>
              <stop stop-color="#2684FF" offset="100%"></stop>
          </linearGradient>
      </defs>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Jira-blue-(2)" transform="translate(18.000000, 18.000000)" fill-rule="nonzero">
              <path d="M68.81,0 L34.23,0 C34.23,4.14002941 35.8746203,8.11049399 38.8020631,11.0379369 C41.729506,13.9653797 45.6999706,15.61 49.84,15.61 L56.21,15.61 L56.21,21.76 C56.2155161,30.3733562 63.1966438,37.3544839 71.81,37.36 L71.81,3 C71.81,1.34314575 70.4668542,1.01453063e-16 68.81,0 Z" id="Shape" fill="#2684FF"></path>
              <path d="M51.7,17.23 L17.12,17.23 C17.1255161,25.8433562 24.1066438,32.8244839 32.72,32.83 L39.09,32.83 L39.09,39 C39.1010357,47.6133534 46.0866395,54.5900071 54.7,54.59 L54.7,20.23 C54.7,18.5731458 53.3568542,17.23 51.7,17.23 Z" id="Shape" fill="url(#linearGradient-1)"></path>
              <path d="M34.58,34.45 L0,34.45 C1.05578821e-15,43.0711649 6.98883506,50.06 15.61,50.06 L22,50.06 L22,56.21 C22.005497,64.8155588 28.9744553,71.7934632 37.58,71.81 L37.58,37.45 C37.58,35.7931458 36.2368542,34.45 34.58,34.45 Z" id="Shape" fill="url(#linearGradient-2)"></path>
          </g>
      </g>
  </svg>
  `,
  itemType: 'markdown',
  workers: [
    async () => {
      const syncer = new Syncer({
        id: 'jira',
        name: 'Jira',
        runner: JiraSyncer,
        interval: 1000 * 60 * 5, // 5 minutes
      })
      await syncer.start()
    },
  ],
  api: createApi(JiraApi),
  graph,
  setupValidate: async app => {
    const loader = new JiraLoader(app)
    await loader.test()
    app.name = extractTeamNameFromDomain(app.data.setup.domain)
  },
  setup: {
    domain: {
      name: 'Domain',
      required: true,
    },
    username: {
      name: 'Username',
      required: true,
    },
    password: {
      name: 'Password',
      required: true,
    },
  },
})

const extractTeamNameFromDomain = (domain: string) => {
  return domain
    .replace('http://', '')
    .replace('https://', '')
    .replace('.atlassian.net/', '')
    .replace('.atlassian.net', '')
}
