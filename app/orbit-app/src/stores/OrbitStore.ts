export type Pane = {
  id: string
  type?: 'list' | 'lists'
  title: string
  icon: string
  show?: boolean
  trigger?: string
  static?: boolean
}

export type Orbit = {
  name: string
  color: string[]
  panes?: Pane[]
}

const getPanes = (): Pane[] => {
  return [
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
      icon: 'menu',
      show: false,
      static: true,
    },
  ]
}

export class OrbitStore {
  activeIndex = 0

  get activeSpace() {
    return this.orbits[this.activeIndex]
  }

  get inactiveSpaces() {
    return this.orbits.filter((_, i) => i !== this.activeIndex)
  }

  orbits: Orbit[] = [
    {
      name: 'Orbit',
      color: ['blue', 'green'],
      panes: getPanes(),
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
