import * as React from 'react'
import { view, react, cancel, ensure, attach } from '@mcro/black'
import { Carousel, CarouselProps } from './Carousel'
import { ORBIT_WIDTH } from '@mcro/constants'
import { SelectionStore } from '../pages/OrbitPage/orbitDocked/SelectionStore'

export type SelectableCarouselProps = CarouselProps & {
  selectionStore?: SelectionStore
  store?: CarouselStore
  isActiveStore?: { isActive?: boolean }
  resetOnInactive?: boolean
  activeIndex?: number
  shouldScrollToActive?: boolean
  afterSpace?: number | boolean
}

class CarouselStore {
  props: SelectableCarouselProps

  carouselRef = React.createRef<Carousel>()

  get activeIndex() {
    if (typeof this.props.activeIndex === 'number') {
      return this.props.activeIndex
    }
    return this.props.selectionStore.activeIndex
  }

  get shouldScroll() {
    if (typeof this.props.shouldScrollToActive === 'boolean') {
      return this.props.shouldScrollToActive
    }
    return this.props.isActiveStore ? this.props.isActiveStore.isActive : false
  }

  handleScrollTo = react(
    () => {
      const index = this.activeIndex
      const { items, offset } = this.props
      const isActive =
        this.shouldScroll &&
        typeof index === 'number' &&
        index >= offset &&
        index <= offset + items.length
      return isActive ? index : false
    },
    indexIfActive => {
      const carousel = this.carouselRef.current
      ensure('node', !!carousel)
      const { offset, selectionStore, resetOnInactive } = this.props
      if (indexIfActive == false) {
        if (resetOnInactive) {
          carousel.scrollTo(0)
        } else {
          throw cancel
        }
      } else {
        const wasClicked = selectionStore.selectEvent === 'click'
        carousel.scrollTo(indexIfActive - offset, { onlyIfOutside: wasClicked })
      }
    },
    {
      deferFirstRun: true,
    },
  )
}

@attach('selectionStore')
@attach({
  store: CarouselStore,
})
@view
export class SelectableCarousel extends React.Component<SelectableCarouselProps> {
  render() {
    const {
      store,
      selectionStore,
      cardWidth = 180,
      cardHeight = 95,
      afterSpace = true,
      ...props
    } = this.props
    const afterWidth = typeof afterSpace === 'number' ? afterSpace : ORBIT_WIDTH - cardWidth - 26
    return (
      <Carousel
        ref={store.carouselRef}
        after={!!afterSpace && <div style={{ width: afterWidth }} />}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        {...props}
      />
    )
  }
}
