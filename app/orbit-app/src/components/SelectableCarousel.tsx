import * as React from 'react'
import { view, react, ensure, cancel } from '@mcro/black'
import { Carousel, CarouselProps } from './Carousel'
import { SelectionStore } from '../apps/orbit/orbitDocked/SelectionStore'
import { App } from '@mcro/stores'

type Props = CarouselProps & {
  selectionStore?: SelectionStore
  store?: CarouselStore
  offset: number
  isActiveStore?: { isActive?: boolean }
  resetOnInactive?: boolean
}

class CarouselStore {
  props: Props

  carouselRef = React.createRef<Carousel>()

  handleScrollTo = react(
    () => [
      this.props.selectionStore.activeIndex,
      this.props.isActiveStore ? this.props.isActiveStore.isActive : null,
    ],
    ([index, isActive]) => {
      const carousel = this.carouselRef.current
      ensure('carousel', !!carousel)
      const { items, offset, selectionStore, resetOnInactive } = this.props
      if (isActive == false) {
        if (resetOnInactive) {
          carousel.scrollTo(0)
        }
        throw cancel
      }
      ensure('index', typeof index === 'number')
      ensure('within bounds', index >= offset && index <= offset + items.length)
      const wasClicked = selectionStore.selectEvent === 'click'
      carousel.scrollTo(index - offset, { onlyIfOutside: wasClicked })
    },
  )
}

@view.attach('selectionStore')
@view.attach({
  store: CarouselStore,
})
export class SelectableCarousel extends React.Component<Props> {
  render() {
    const { store, selectionStore, cardWidth = 180, cardHeight = 95, ...props } = this.props
    return (
      <Carousel
        ref={store.carouselRef}
        after={<div style={{ width: App.orbitState.size[0] - cardWidth - 20 }} />}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        {...props}
      />
    )
  }
}
