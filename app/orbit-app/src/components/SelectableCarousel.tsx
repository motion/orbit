import * as React from 'react'
import { view, react } from '@mcro/black'
import { Carousel, CarouselProps } from './Carousel'
import { SelectionStore } from '../stores/SelectionStore'

type Props = CarouselProps & {
  store?: CarouselStore
  offset: number
}

class CarouselStore {
  props: CarouselProps & {
    selectionStore: SelectionStore
  }

  carouselRef = React.createRef<Carousel>()

  handleScrollTo = react(
    () => this.props.selectionStore.activeIndex,
    index => {
      const { items, offset, selectionStore } = this.props
      react.ensure(selectionStore.selectEvent !== 'click')
      react.ensure(index >= offset && index <= offset + items.length)
      react.ensure(this.carouselRef.current)
      const scrollTo = offset + index
      if (typeof scrollTo === 'number') {
        this.carouselRef.current.scrollTo(scrollTo)
      }
    },
  )
}

@view.attach('selectionStore')
@view.attach({
  store: CarouselStore,
})
export class SelectableCarousel extends React.Component<Props> {
  render() {
    const { store, selectionStore, ...props } = this.props
    return <Carousel ref={store.carouselRef} {...props} />
  }
}
