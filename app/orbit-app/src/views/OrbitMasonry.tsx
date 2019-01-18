import { ORBIT_WIDTH } from '@mcro/constants'
import * as React from 'react'
import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
} from 'react-virtualized'
import { ListItemProps } from './ListItems/ListItem'
import { OrbitCard } from './OrbitCard'

const middleSpace = 3
const width = ORBIT_WIDTH
const columnCount = 2
const columnWidth = width / columnCount

type Props = {
  items: any[]
  overscanByPixels?: number
  sidePad?: number
  height?: number
  offset?: number
  cardProps?: ListItemProps
  CardView: any
  direct?: boolean
}

export class OrbitMasonry extends React.Component<Props> {
  static defaultProps = {
    overscanByPixels: 1000,
    sidePad: 6,
    height: 600,
    offset: 0,
    CardView: OrbitCard,
  }

  cache = new CellMeasurerCache({
    defaultHeight: 250,
    defaultWidth: columnWidth,
    fixedWidth: true,
  })

  cellPositioner = createMasonryCellPositioner({
    cellMeasurerCache: this.cache,
    columnCount,
    columnWidth: columnWidth,
    spacer: middleSpace,
  })

  cellRenderer = ({ index, key, parent, style }) => {
    const { CardView, items, cardProps, sidePad, offset } = this.props
    const item = items[index]
    const itemProps = cardProps && cardProps.direct ? item : { model: item }
    return (
      <CellMeasurer cache={this.cache} index={index} key={key} parent={parent}>
        <div
          style={{
            ...style,
            width: style.width - (sidePad || 0) / 2,
            paddingLeft: style.left === 0 ? sidePad : 0,
            paddingRight: style.left === 0 ? 0 : sidePad,
          }}
        >
          <CardView direct index={index + offset} {...cardProps} {...itemProps} />
        </div>
      </CellMeasurer>
    )
  }

  render() {
    return (
      <Masonry
        cellCount={this.props.items.length}
        cellMeasurerCache={this.cache}
        cellPositioner={this.cellPositioner}
        cellRenderer={this.cellRenderer}
        height={this.props.height}
        width={width}
        overscanByPixels={this.props.overscanByPixels}
      />
    )
  }
}
