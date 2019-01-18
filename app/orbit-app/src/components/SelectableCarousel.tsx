import { cancel, ensure, react } from '@mcro/black'
import { ORBIT_WIDTH } from '@mcro/constants'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { SelectionStore } from '../stores/SelectionStore'
import { Carousel, CarouselProps } from '../views/Carousel'

export type SelectableCarouselProps = CarouselProps & {
  isActiveStore?: { isActive?: boolean }
  resetOnInactive?: boolean
  activeIndex?: number
  shouldScrollToActive?: boolean
  afterSpace?: number | boolean
}

class CarouselStore {
  props: SelectableCarouselProps & {
    selectionStore: SelectionStore
  }

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

export default observer(function SelectableCarousel(props: SelectableCarouselProps) {
  const { selectionStore } = useStoresSafe()
  const store = useStore(CarouselStore, { ...props, selectionStore })
  const { cardWidth = 180, cardHeight = 95, afterSpace = true, ...rest } = props
  const afterWidth = typeof afterSpace === 'number' ? afterSpace : ORBIT_WIDTH - cardWidth - 26
  return (
    <Carousel
      ref={store.carouselRef}
      after={!!afterSpace && <div style={{ width: afterWidth }} />}
      cardWidth={cardWidth}
      cardHeight={cardHeight}
      {...rest}
    />
  )
})
