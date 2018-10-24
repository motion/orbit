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
          title: 'Home',
          icon: 'house',
        },
        {
          title: 'Search',
          icon: 'singleNeutralSearch',
        },
        {
          title: 'People',
          icon: 'multipleNeutral2',
        },
        {
          title: 'Topics',
          icon: 'singleNeutralChat',
        },
        {
          title: 'Onboarding',
          icon: 'listBullets',
        },
        {
          title: 'Help',
          icon: 'questionCircle',
        },
        {
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
