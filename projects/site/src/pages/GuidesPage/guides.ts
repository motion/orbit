import { Color } from '@o/ui'

import { colors } from '../../colors'

export const guideCategories = {
  useCases: 'Use Cases',
  dev: 'Developing',
}

export type GuideEntry = {
  view: () => Promise<{
    default: any
  }>
  title: string
  date: string
  icon: string
  color: Color
  categories: (keyof typeof guideCategories)[]
  preview?: string
  private?: boolean
}

export type GuideIndex = {
  [key: string]: GuideEntry
}

// order important, most recent at top
export const guides: GuideIndex = {
  spotlight: {
    view: () => import('./first-app/index.mdx'),
    title: 'Your Personal Spotlight',
    date: '2018-10-05T22:12:03.284Z',
    icon: 'hi',
    color: colors.orange,
    categories: ['useCases'],
  },
  notes: {
    view: () => import('./first-app/index.mdx'),
    title: 'Taking Notes',
    date: '2018-10-05T22:12:03.284Z',
    icon: 'hi',
    color: colors.purple,
    categories: ['useCases'],
  },
  third: {
    view: () => import('./first-app/index.mdx'),
    title: 'Creating your first app',
    date: '2018-10-05T22:12:03.284Z',
    icon: 'hi',
    color: colors.red,
    categories: ['dev'],
  },
  fourth: {
    view: () => import('./first-app/index.mdx'),
    title: 'Syncing data',
    date: '2018-10-05T22:12:03.284Z',
    icon: 'hi',
    color: colors.orange,
    categories: ['dev'],
  },
  fifth: {
    view: () => import('./first-app/index.mdx'),
    title: 'Rendering content',
    date: '2018-10-05T22:12:03.284Z',
    icon: 'hi',
    color: colors.purple,
    categories: ['dev'],
  },
}
