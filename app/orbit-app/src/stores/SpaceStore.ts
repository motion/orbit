import { ensure, react } from '@mcro/black'
import { observeMany } from '@mcro/model-bridge'
import { AppModel, Source, SourceModel, Space, SpaceModel } from '@mcro/models'
import { getAppFromSource } from './SourcesStore'

export class SpaceStore {
  spaces: Space[] = []
  sources: Source[] = []
  activeIndex = 0

  get activeSortedSpaces() {
    return this.spaces.length ? [this.activeSpace, ...this.inactiveSpaces] : []
  }

  get activeSpace() {
    return this.spaces[this.activeIndex] || { id: 0 }
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
