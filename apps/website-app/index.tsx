import { createApp } from '@o/kit'

import { WebsiteSyncerWorker } from './WebsiteSyncerWorker.node'

export default createApp({
  id: 'website',
  name: 'Website',
  itemType: 'task',
  workers: [WebsiteSyncerWorker],
  setup: {
    url: {
      name: 'URL',
      required: true,
    },
  },
  icon: `<svg version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 58 58">
    <rect style="fill:#ECF0F1;" width="58" height="58" />
    <rect style="fill:#546A79;" width="58" height="12" />
    <circle style="fill:#ED7161;" cx="6" cy="6" r="3" />
    <circle style="fill:#F0C419;" cx="15" cy="6" r="3" />
    <circle style="fill:#4FBA6F;" cx="24" cy="6" r="3" />
    <rect x="4" y="21" style="fill:#FFFFFF;" width="14" height="20" />
    <rect x="4" y="21" style="fill:#0096E6;" width="14" height="5" />
    <rect x="40" y="21" style="fill:#FFFFFF;" width="14" height="20" />
    <rect x="40" y="21" style="fill:#0096E6;" width="14" height="5" />
    <rect x="22" y="17" style="fill:#FFFFFF;" width="14" height="28" />
    <rect x="22" y="17" style="fill:#0096E6;" width="14" height="5" />
    <rect x="7" y="34" style="fill:#4FBA6F;" width="8" height="4" />
    <rect x="25" y="38" style="fill:#4FBA6F;" width="8" height="4" />
    <rect x="43" y="34" style="fill:#4FBA6F;" width="8" height="4" />
    <path
      style="fill:#95A5A5;"
      d="M18,50H4c-0.553,0-1-0.447-1-1s0.447-1,1-1h14c0.553,0,1,0.447,1,1S18.553,50,18,50z"
    />
    <path
      style="fill:#95A5A5;"
      d="M18,53H4c-0.553,0-1-0.447-1-1s0.447-1,1-1h14c0.553,0,1,0.447,1,1S18.553,53,18,53z"
    />
    <path
      style="fill:#95A5A5;"
      d="M36,50H22c-0.553,0-1-0.447-1-1s0.447-1,1-1h14c0.553,0,1,0.447,1,1S36.553,50,36,50z"
    />
    <path
      style="fill:#95A5A5;"
      d="M36,53H22c-0.553,0-1-0.447-1-1s0.447-1,1-1h14c0.553,0,1,0.447,1,1S36.553,53,36,53z"
    />
    <path
      style="fill:#95A5A5;"
      d="M54,50H40c-0.553,0-1-0.447-1-1s0.447-1,1-1h14c0.553,0,1,0.447,1,1S54.553,50,54,50z"
    />
    <path
      style="fill:#95A5A5;"
      d="M54,53H40c-0.553,0-1-0.447-1-1s0.447-1,1-1h14c0.553,0,1,0.447,1,1S54.553,53,54,53z"
    />
  </svg>`,
})
