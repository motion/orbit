import * as React from 'react'
import { OrbitCard } from '../views/OrbitCard'
import {
  HorizontalScrollRow,
  HorizontalScrollRowProps,
} from '../views/HorizontalScrollRow'

type CarouselProps = HorizontalScrollRowProps & {
  items?: any[]
  verticalPadding?: number
  cardWidth?: number
  cardHeight?: number
  cardSpace?: number
  cardProps?: Object
  before?: React.ReactNode
  after?: React.ReactNode
  children?: React.ReactNode
  offset?: number
  scrollTo?: number
  className?: string
}

export class Carousel extends React.Component<CarouselProps> {
  frameRef = React.createRef<HTMLDivElement>()

  componentDidUpdate(prevProps) {
    if (prevProps.scrollTo != this.props.scrollTo) {
      this.scrollTo(this.props.scrollTo)
    }
  }

  get cardRefs(): HTMLDivElement[] {
    return Array.from(
      this.frameRef.current.querySelectorAll('.carousel-result-item'),
    )
  }

  scrollTo = index => {
    const frame = this.frameRef.current
    if (!frame) return
    const activeCard = this.cardRefs[index]
    if (!activeCard) return
    frame.scrollLeft = activeCard.offsetLeft - 12
  }

  render() {
    const {
      items,
      verticalPadding = 3,
      cardWidth = 180,
      cardHeight = 90,
      cardSpace = 12,
      cardProps = {},
      offset = 0,
      className,
      before,
      after,
      ...props
    } = this.props
    return (
      <HorizontalScrollRow
        forwardRef={this.frameRef}
        height={cardHeight + verticalPadding * 2}
        {...props}
      >
        {before}
        {(items || []).map((bit, index) => (
          <OrbitCard
            key={`${index}${bit.id}`}
            index={index + offset}
            className={`carousel-result-item ${className || ''}`}
            pane="carousel"
            bit={bit}
            total={items.length}
            inGrid
            {...cardProps}
            style={{
              width: cardWidth,
              height: cardHeight,
              marginRight: cardSpace,
              ...cardProps['style'],
            }}
          />
        ))}
        {after}
      </HorizontalScrollRow>
    )
  }
}
