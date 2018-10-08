import * as React from 'react'
import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
} from 'react-virtualized'
import { ORBIT_WIDTH } from '@mcro/constants'

const middleSpace = 6
const width = ORBIT_WIDTH - middleSpace
const columnCount = 2
const columnWidth = width / columnCount

type Props = {
  items: any[]
  overscanByPixels?: number
}

export class OrbitMasonry extends React.Component<Props> {
  static defaultProps = {
    overscanByPixels: 1000,
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
    return (
      <CellMeasurer cache={this.cache} index={index} key={key} parent={parent}>
        <div style={style}>{item}</div>
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
        height={600}
        width={width}
        overscanByPixels={this.props.overscanByPixels}
      />
    )
  }
}
