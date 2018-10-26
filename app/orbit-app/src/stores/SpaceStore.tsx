export type Space = {
  name: string
  color: string[]
  panes?: {
    id: string
    type?: 'list' | 'lists'
    title: string
    icon: string
    show?: boolean
    trigger?: string
    static?: boolean
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
          static: true,
        },
        {
          id: 'search',
          title: 'Search',
          icon: 'singleNeutralSearch',
          static: true,
        },
        {
          id: 'people',
          title: 'People',
          icon: 'multipleNeutral2',
          trigger: '@',
          static: true,
        },
        {
          id: 'lists',
          type: 'lists',
          title: 'Lists',
          icon: 'listBullets',
          trigger: '/',
          static: true,
        },
        {
          id: 'mylist',
          type: 'list',
          title: 'First List',
          icon: 'singleNeutralChat',
          // trigger: '#',
        },
        {
          id: 'new',
          title: 'New',
          icon: 'add',
          show: false,
          static: true,
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
