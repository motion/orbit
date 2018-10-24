import * as React from 'react'
import { Icon } from '../views/Icon'

export class SpaceStore {
  panes = [
    {
      title: 'Home',
      icon: <Icon size={14} name="house" />,
    },
    {
      title: 'Search',
      icon: <Icon size={14} name="singleNeutralSearch" />,
    },
    {
      title: 'People',
      icon: <Icon size={14} name="multipleNeutral2" />,
    },
    {
      title: 'Topics',
      icon: <Icon size={14} name="singleNeutralChat" />,
    },
    {
      title: 'Onboarding',
      icon: <Icon size={14} name="listBullets" />,
    },
    {
      title: 'Help',
      icon: <Icon size={14} name="questionCircle" />,
    },
    {
      title: 'New',
      icon: <Icon size={14} name="add" />,
      show: false,
    },
  ]
}
