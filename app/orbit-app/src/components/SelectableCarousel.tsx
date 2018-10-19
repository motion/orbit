import * as React from 'react'
import { view, react, cancel, ensure } from '@mcro/black'
import { Carousel, CarouselProps } from './Carousel'
import { ORBIT_WIDTH } from '@mcro/constants'
import { SelectionStore } from '../pages/OrbitPage/orbitDocked/SelectionStore'

export type SelectableCarouselProps = CarouselProps & {
  selectionStore?: SelectionStore
  store?: CarouselStore
  isActiveStore?: { isActive?: boolean }
  resetOnInactive?: boolean
}

class CarouselStore {
  props: SelectableCarouselProps

  carouselRef = React.createRef<Carousel>()

  handleScrollTo = react(
    () => {
      const index = this.props.selectionStore.activeIndex
      const isShowing = this.props.isActiveStore ? this.props.isActiveStore.isActive : null
      const { items, offset } = this.props
      const isActive =
        isShowing && typeof index === 'number' && index >= offset && index <= offset + items.length
      return isActive ? index : false
    },
    indexIfActive => {
      const carousel = this.carouselRef.current
      ensure('node', !!carousel)
      const { offset, selectionStore, resetOnInactive } = this.props
      if (indexIfActive == false) {
        if (resetOnInactive) {
          carousel.scrollTo(0)
        }
        throw cancel
      }
      const wasClicked = selectionStore.selectEvent === 'click'
      carousel.scrollTo(indexIfActive - offset, { onlyIfOutside: wasClicked })
    },
    {
      deferFirstRun: true,
    },
  )
}

@view.attach('selectionStore')
@view.attach({
  store: CarouselStore,
})
@view
export class SelectableCarousel extends React.Component<SelectableCarouselProps> {
  render() {
    const { store, selectionStore, cardWidth = 180, cardHeight = 95, ...props } = this.props
    return (
      <Carousel
        ref={store.carouselRef}
        after={<div style={{ width: ORBIT_WIDTH - cardWidth - 20 }} />}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        {...props}
      />
    )
  }
}
