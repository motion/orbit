import { observeMany } from '@mcro/model-bridge'
import { Space, SpaceModel, Source } from '@mcro/models'
import { SourceModel } from '@mcro/models'
import { AppType } from '../apps/apps'
import { getAppFromSource } from './SourcesStore'

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
    title: 'People',
    icon: 'multipleNeutral2',
    trigger: '@',
    static: true,
    props: {
      preventScroll: true,
    },
  },
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

  spaceSources(space: Space) {
    return this.sources
      .filter(source => source.spaceId === space.id)
      .map(getAppFromSource) // todo: this is temporary to make things working, Nate should change that
  }

  activeSources() {
    return this.sources
      .filter(source => source.spaceId === this.activeSpace.id)
      .map(getAppFromSource) // todo: this is temporary to make things working, Nate should change that
  }

  willUnmount() {
    this.spaces$.unsubscribe()
    this.sources$.unsubscribe()
  }

  private spaces$ = observeMany(SpaceModel, { args: {} }).subscribe(spaces => {
    this.spaces = spaces
  })

  private sources$ = observeMany(SourceModel, { args: {} }).subscribe(sources => {
    this.sources = sources
  })

}
