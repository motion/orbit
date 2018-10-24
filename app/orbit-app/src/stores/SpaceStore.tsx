export class SpaceStore {
  activeIndex = 0

  get activeSpace() {
    return this.spaces[this.activeIndex]
  }

  get inactiveSpaces() {
    return this.spaces.filter((_, i) => i !== this.activeIndex)
  }

  spaces = [
    {
      name: 'Orbit',
      color: 'blue',
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
        },
        {
          id: 'topics',
          title: 'Topics',
          icon: 'singleNeutralChat',
        },
        {
          id: 'onboarding',
          title: 'Onboarding',
          icon: 'listBullets',
        },
        {
          id: 'help',
          title: 'Help',
          icon: 'questionCircle',
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
      color: 'gray',
      panes: [],
    },
    {
      name: 'Discussions',
      color: 'red',
      panes: [],
    },
  ]
}
