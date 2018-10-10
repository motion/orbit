import * as React from 'react'
import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
} from 'react-virtualized'
import { ORBIT_WIDTH } from '@mcro/constants'
import { OrbitSearchCard } from '../apps/orbit/orbitDocked/orbitHome/OrbitSearchCard'

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
  cardProps?: Object
  CardView: any
}

export class OrbitMasonry extends React.Component<Props> {
  static defaultProps = {
    overscanByPixels: 1000,
    sidePad: 6,
    height: 600,
    offset: 0,
    CardView: OrbitSearchCard,
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
    const item = this.props.items[index]
    const { CardView } = this.props
    return (
      <CellMeasurer cache={this.cache} index={index} key={key} parent={parent}>
        <div
          style={{
            ...style,
            paddingLeft: style.left === 0 ? this.props.sidePad : 0,
            paddingRight: style.left === 0 ? 0 : this.props.sidePad,
          }}
        >
          <CardView index={index + this.props.offset} {...this.props.cardProps} model={item} />
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
