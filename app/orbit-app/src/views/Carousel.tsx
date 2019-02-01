import * as React from 'react'
import scroll from 'scroll'
import { HorizontalScrollRow, HorizontalScrollRowProps } from './HorizontalScrollRow'
import { ListItemProps } from './ListItems/ListItem'
import { OrbitCard } from './OrbitCard'

export type CarouselProps = HorizontalScrollRowProps & {
  CardView?: (props: ListItemProps) => JSX.Element
  items?: any[]
  verticalPadding?: number
  cardWidth?: number
  cardHeight?: number
  cardSpace?: number
  cardProps?: ListItemProps
  before?: React.ReactNode
  after?: React.ReactNode
  children?: React.ReactNode
  offset: number
  className?: string
}

export class Carousel extends React.PureComponent<CarouselProps> {
  static defaultProps = {
    CardView: OrbitCard,
  }

  frameRef = React.createRef<HTMLDivElement>()

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
      cardWidth = 170,
      cardHeight = 80,
      cardSpace = 10,
      cardProps = {},
      offset = 0,
      className,
      before,
      after,
      CardView,
      ...props
    } = this.props

    return (
      <HorizontalScrollRow ref={this.frameRef} height={cardHeight + verticalPadding * 2} {...props}>
        {before}
        {(items || []).map((item, index) => (
          <CardView
            key={`${index}${item.id}`}
            index={index + offset}
            className={`carousel-result-item ${className || ''}`}
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
