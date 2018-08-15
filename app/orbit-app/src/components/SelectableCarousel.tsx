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
    () => this.props.selectionStore.nextIndex,
    index => {
      const scrollTo = this.props.offset + index
      if (!this.carouselRef.current) {
        throw new Error('no carousel ref...')
      }
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
