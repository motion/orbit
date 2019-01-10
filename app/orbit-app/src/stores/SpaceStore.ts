import { observeMany } from '@mcro/model-bridge'
import { Source, SourceModel, Space, SpaceModel, AppType, AppModel } from '@mcro/models'
import { getAppFromSource } from './SourcesStore'
import { react, ensure } from '@mcro/black'

export type Pane = {
  id: string
  type: AppType
  title: string
  icon: string
  show?: boolean
  trigger?: string
  static?: boolean
  isHidden?: boolean
  props?: {
    preventScroll?: boolean
  }
}

export const AppPanes: Pane[] = [
  // {
  //   id: 'home',
  //   type: 'home',
  //   icon: 'orbit',
  //   title: 'Home',
  // },
  {
    id: 'search',
    type: 'search',
    title: 'Search',
    icon: 'orbitsearch',
    props: {
      preventScroll: true,
    },
  },
  {
    id: 'people',
    type: 'people',
    title: 'People',
    icon: 'orbitpeople',
    trigger: '@',
    props: {
      preventScroll: true,
    },
  },
  {
    id: 'topics',
    type: 'topics',
    icon: 'orbittopics',
    title: 'Topics',
    trigger: '#',
  },
]

export class SpaceStore {
  spaces: Space[] = []
  sources: Source[] = []
  activeIndex = 0

  get activeSortedSpaces() {
    return this.spaces.length ? [this.activeSpace, ...this.inactiveSpaces] : []
  }

  get activeSpace() {
    return this.spaces[this.activeIndex]
  }

  get inactiveSpaces() {
    return this.spaces.filter((_, i) => i !== this.activeIndex)
  }

  apps = react(
    () => this.activeSpace,
    space => {
      ensure('space', !!space)
      return observeMany(AppModel, { args: { where: { spaceId: space.id } } })
    },
    {
      defaultValue: [],
    },
  )

  spaceSources(space: Space) {
    return this.sources
      .filter(source => {
        return source.spaces.find(sourceSpace => sourceSpace.id === space.id)
      })
      .map(getAppFromSource) // todo: this is temporary to make things working, Nate should change that
  }

  activeSources() {
    return this.sources
      .filter(source => {
        return source.spaces.find(sourceSpace => sourceSpace.id === this.activeSpace.id)
      })
      .map(getAppFromSource) // todo: this is temporary to make things working, Nate should change that
  }

  willUnmount() {
    this.spaces$.unsubscribe()
    this.sources$.unsubscribe()
  }

  private spaces$ = observeMany(SpaceModel, { args: {} }).subscribe(spaces => {
    this.spaces = spaces
  })

  private sources$ = observeMany(SourceModel, {
    args: {
      relations: ['spaces'],
    },
  }).subscribe(sources => {
    this.sources = sources
  })
}
