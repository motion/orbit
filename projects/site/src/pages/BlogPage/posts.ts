import nateImg from '../../../public/images/nate.jpg'

export type PostEntry = {
  view: () => Promise<{ default: any }>
  title: string
  date: string
  author: string
  authorImage: string
  preview?: string
}

export type PostDirectory = {
  [key: string]: PostEntry
}

// order important, most recent at top
export const posts: PostDirectory = {
  releases: {
    view: () => import('./releases/index.mdx'),
    title: 'Releases',
    date: '2018-10-05T22:12:03.284Z',
    author: 'Nathan Wienert',
    authorImage: nateImg,
  },
  'update-one': {
    view: () => import('./update-one/index.mdx'),
    title: 'Update One',
    date: '2018-09-29T22:12:03.284Z',
    author: 'Nathan Wienert',
    authorImage: nateImg,
  },
}
