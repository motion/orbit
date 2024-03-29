import nateImg from '../../public/images/nate.jpg'
import { PostEntry } from './PostEntry'

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
    private: true,
  },
  'update-one': {
    view: () => import('./update-one/index.mdx'),
    title: 'Update One',
    date: '2018-09-29T22:12:03.284Z',
    author: 'Nathan Wienert',
    authorImage: nateImg,
  },
  'update-two': {
    view: () => import('./update-two/index.mdx'),
    title: 'Orbit enters private beta',
    date: '2019-04-25T22:12:03.284Z',
    author: 'Nathan Wienert',
    authorImage: nateImg,
    private: true,
  },
  launch: {
    view: () => import('./launch/index.mdx'),
    title: 'Orbit is a longshot',
    date: '2019-04-25T22:12:03.284Z',
    author: 'Nathan Wienert',
    authorImage: nateImg,
    private: true,
  },
}
