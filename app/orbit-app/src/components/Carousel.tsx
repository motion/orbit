import * as React from 'react'
import { OrbitCard } from '../views/OrbitCard'
import { HorizontalScrollRow, HorizontalScrollRowProps } from '../views/HorizontalScrollRow'
import isEqual from 'react-fast-compare'
import scroll from 'scroll'

export type CarouselProps = HorizontalScrollRowProps & {
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
  className?: string
}

export class Carousel extends React.Component<CarouselProps> {
  frameRef = React.createRef<HTMLDivElement>()

  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps, this.props)
  }

  get cardRefs(): HTMLDivElement[] {
    return Array.from(this.frameRef.current.querySelectorAll('.carousel-result-item'))
  }

  lastScroll = Date.now()

  scrollTo = (index, { onlyIfOutside = false } = {}) => {
    const frame = this.frameRef.current
    if (!frame) return
    const activeCard = this.cardRefs[index]
    if (!activeCard) return
    const duration = 90
    const scrollTo = activeCard.offsetLeft - 12
    if (onlyIfOutside) {
      // leave it disabled for now...
      // console.log(
      //   'onlyIfOutside',
      //   scrollTo,
      //   frame.getBoundingClientRect(),
      //   activeCard.getBoundingClientRect(),
      // )
    }
    // dont animate if fast
    if (Date.now() - this.lastScroll < duration) {
      frame.scrollLeft = scrollTo
    } else {
      scroll.left(frame, scrollTo, { duration })
    }
    this.lastScroll = Date.now()
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
    // @ts-ignore wierd ass bug, checking...
    if (items.target === 'job') {
      debugger
    }
    return (
      <HorizontalScrollRow
        forwardRef={this.frameRef}
        height={cardHeight + verticalPadding * 2}
        {...props}
      >
        {before}
        {(items || []).map((item, index) => (
          <OrbitCard
            key={`${index}${item.id}`}
            index={index + offset}
            className={`carousel-result-item ${className || ''}`}
            pane="carousel"
            model={item}
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
