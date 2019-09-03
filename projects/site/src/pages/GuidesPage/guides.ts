export type GuideEntry = {
  view: () => Promise<{
    default: any
  }>
  title: string
  date: string
  preview?: string
  private?: boolean
}

export type GuideIndex = {
  [key: string]: GuideEntry
}

// order important, most recent at top
export const guides: GuideIndex = {
  firstApp: {
    view: () => import('./first-app/index.mdx'),
    title: 'First App',
    date: '2018-10-05T22:12:03.284Z',
  },
}
