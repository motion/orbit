import { AppType } from '../apps/apps'

export type Pane = {
  id: string
  type: AppType
  title: string
  icon: string
  show?: boolean
  trigger?: string
  static?: boolean
  props?: {
    preventScroll?: boolean
  }
}

export type Orbit = {
  name: string
  color: string[]
  panes?: Pane[]
}

export class OrbitStore {
  activeIndex = 0

  get activeSpace() {
    return this.orbits[this.activeIndex]
  }

  get inactiveSpaces() {
    return this.orbits.filter((_, i) => i !== this.activeIndex)
  }

  getPanes = (): Pane[] => {
    return [
      {
        id: 'home',
        type: 'search',
        title: 'Search',
        icon: 'singleNeutralSearch',
        static: true,
        props: {
          preventScroll: true,
        },
      },
      {
        id: 'people',
        type: 'people',
        title: '@people',
        icon: 'multipleNeutral2',
        trigger: '@',
        static: true,
      },
      {
        id: 'topics',
        type: 'topics',
        title: '#topics',
        icon: 'singleNeutralChat',
        trigger: '#',
        static: true,
      },
      {
        id: 'lists',
        type: 'lists',
        title: '/lists',
        icon: 'listBullets',
        trigger: '/',
        static: true,
      },
    ]
  }

  orbits: Orbit[] = [
    {
      name: 'Orbit',
      color: ['blue', 'green'],
      panes: this.getPanes(),
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
