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
        title: 'Home',
        icon: 'singleNeutralSearch',
        static: true,
        props: {
          preventScroll: true,
        },
      },
      // {
      //   type: 'recent',
      //   title: 'Recent',
      //   icon: 'menu',
      //   static: true,
      // },
      {
        id: 'topics',
        type: 'topics',
        title: 'Topics',
        icon: 'singleNeutralChat',
        trigger: '#',
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
        id: 'people',
        type: 'people',
        title: 'People',
        icon: 'multipleNeutral2',
        trigger: '@',
        static: true,
      },
      // {
      //   type: 'new',
      //   title: 'New',
      //   icon: 'cog',
      //   show: false,
      //   static: true,
      // },
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
