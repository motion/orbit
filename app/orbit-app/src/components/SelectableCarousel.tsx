import * as React from 'react'
import { view, react } from '@mcro/black'
import { Carousel, CarouselProps } from './Carousel'
import { SelectionStore } from '../stores/SelectionStore'
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
    () => this.props.selectionStore.activeIndex,
    index => {
      react.ensure('has carousel', !!this.carouselRef.current)
      const {
        items,
        offset,
        selectionStore,
        isActiveStore,
        resetOnInactive,
      } = this.props
      if (isActiveStore && !isActiveStore.isActive) {
        console.log('NOT ACTRIVve', this)
        if (resetOnInactive) {
          this.carouselRef.current.scrollTo(0)
        }
        throw react.cancel
      }
      const scrollTo = offset + index
      react.ensure('wasnt clicked', selectionStore.selectEvent !== 'click')
      react.ensure(
        'within bounds',
        index >= offset && index <= offset + items.length,
      )
      react.ensure('has scrollTo', typeof scrollTo === 'number')
      this.carouselRef.current.scrollTo(scrollTo)
    },
  )
}

@view.attach('selectionStore')
@view.attach({
  store: CarouselStore,
})
export class SelectableCarousel extends React.Component<Props> {
  render() {
    const {
      store,
      selectionStore,
      cardWidth = 180,
      cardHeight = 90,
      ...props
    } = this.props
    return (
      <Carousel
        ref={store.carouselRef}
        after={
          <div style={{ width: App.orbitState.size[0] - cardWidth - 20 }} />
        }
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        {...props}
      />
    )
  }
}
