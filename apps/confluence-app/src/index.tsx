import { createApi, createApp } from '@o/kit'

import { ConfluenceApi } from './api.node'
import { ConfluenceLoader } from './ConfluenceLoader'
import { ConfluenceAppData } from './ConfluenceModels'
import { ConfluenceSyncer } from './ConfluenceSyncer.node'
import { Syncer } from '@o/worker-kit'

export default createApp<ConfluenceAppData>({
  id: 'confluence',
  name: 'Confluence',
  itemType: 'markdown',
  workers: [
    async () => {
      const syncer = new Syncer({
        id: 'confluence',
        name: 'Confluence',
        runner: ConfluenceSyncer,
        interval: 1000 * 60 * 5, // 5 minutes
      })
      await syncer.start()
    },
  ],
  api: createApi(ConfluenceApi),
  setupValidate: async app => {
    const loader = new ConfluenceLoader(app)
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
  icon: `
  <svg id="service-confluence" viewBox="0 0 124 124">
    <defs>
      <linearGradient id="a" x1="99.1429999%" x2="33.8573075%" y1="112.7135%" y2="37.7570769%">
        <stop stop-color="#0052CC" offset="0%"/>
        <stop stop-color="#0052CC" offset="18%"/>
        <stop stop-color="#2684FF" offset="100%"/>
      </linearGradient>
      <linearGradient id="b" x1=".9185263%" x2="66.1780445%" y1="-12.5961943%" y2="62.2896002%">
        <stop stop-color="#0052CC" offset="0%"/>
        <stop stop-color="#0052CC" offset="18%"/>
        <stop stop-color="#2684FF" offset="100%"/>
      </linearGradient>
    </defs>
    <g fill="none" fill-rule="evenodd">
      <path fill="url(#a)" fill-rule="nonzero" d="M29.6427277 80.4128653c-.753387 1.2331796-1.5994985 2.6574153-2.3239091 3.7979617-.6374813 1.0826507-.2897642 2.4953072.7823634 3.1553188l15.1025118 9.2864797C43.574592 96.8784189 43.9918525 97 44.4264988 97c.8171352 0 1.5763174-.4342182 1.9993732-1.1347569.6027096-1.0073862 1.3792778-2.3216199 2.2311846-3.7284868 5.9807337-9.8654372 12.0020345-8.6554158 22.8508073-3.479535l14.9808108 7.1153886c.3129453.150529.6548671.2257935.9967889.2257935.9214503 0 1.7559713-.5442201 2.1268695-1.3894982l7.1919482-16.2513393c.5099851-1.1521256-.0115906-2.5126759-1.1590569-3.0395273-3.1584301-1.487921-9.446314-4.4463942-15.1083071-7.1732844-20.3530396-9.8770164-37.6577595-9.240163-50.8941896 12.2681111z"/>
      <path fill="url(#b)" fill-rule="nonzero" d="M94.3590214 43.6107554c.7528884-1.2257154 1.5984399-2.6537894 2.322371-3.7869979.6370594-1.0811734.2895725-2.497684-.7818456-3.1567951L80.8070311 27.393154C80.4247955 27.1387602 79.9730625 27 79.5097466 27c-.8281772 0-1.5984399.4451891-2.0154242 1.1621169-.6023107 1.0060116-1.3783648 2.3184521-2.2297078 3.7176177-5.9767752 9.8577577-11.9940906 8.6493874-22.8356828 3.480569l-14.9245637-7.0709898c-.3127382-.1503236-.6544337-.2254854-.9961292-.2254854-.9208404 0-1.754809.5434775-2.1254617 1.3818206l-7.187188 16.2291647c-.5096475 1.1505536.0115828 2.5150291 1.1582897 3.0411616 3.1563396 1.4801091 9.4400616 4.4345456 15.0983072 7.1634967 20.3858999 9.851976 37.6791662 9.192865 50.9068353-12.2687166z"/>
    </g>
  </svg>
  `,
})

const extractTeamNameFromDomain = (domain: string) => {
  return domain
    .replace('http://', '')
    .replace('https://', '')
    .replace('.atlassian.net/', '')
    .replace('.atlassian.net', '')
}
