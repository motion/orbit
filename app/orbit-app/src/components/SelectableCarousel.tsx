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
      const scrollTo = offset + index
      react.ensure('wasnt clicked', selectionStore.selectEvent !== 'click')
      react.ensure(
        'within bounds',
        index >= offset && index <= offset + items.length,
      )
      react.ensure('has carousel', !!this.carouselRef.current)
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
    // @ts-ignore
    const { store, selectionStore, ...props } = this.props
    return <Carousel ref={store.carouselRef} {...props} />
  }
}
