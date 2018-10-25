export type Space = {
  name: string
  color: string[]
  panes?: {
    id: string
    title: string
    icon: string
    show?: boolean
    trigger?: string
  }[]
}

export class SpaceStore {
  activeIndex = 0

  get activeSpace() {
    return this.spaces[this.activeIndex]
  }

  get inactiveSpaces() {
    return this.spaces.filter((_, i) => i !== this.activeIndex)
  }

  spaces: Space[] = [
    {
      name: 'Orbit',
      color: ['blue', 'green'],
      panes: [
        {
          id: 'home',
          title: 'Home',
          icon: 'house',
        },
        {
          id: 'search',
          title: 'Search',
          icon: 'singleNeutralSearch',
        },
        {
          id: 'people',
          title: 'People',
          icon: 'multipleNeutral2',
          trigger: '@',
        },
        {
          id: 'topics',
          title: 'Topics',
          icon: 'singleNeutralChat',
          trigger: '#',
        },
        {
          id: 'list',
          title: 'Lists',
          icon: 'listBullets',
          trigger: '/',
        },
        {
          id: 'new',
          title: 'New',
          icon: 'add',
          show: false,
        },
      ],
    },
    {
      name: 'Me',
      color: ['red', 'gray'],
      panes: [],
    },
    {
      name: 'Discussions',
      color: ['blue', 'red'],
      panes: [],
    },
  ]
}
