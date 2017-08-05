// @flow
import React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { filterItem } from './helpers'
import { User } from '~/app'

class BarBrowseStore {
  @watch
  children = [
    () => this.parent && this.parent.id,
    () => this.parent && this.parent.getChildren(),
  ]

  get parent() {
    return this.props.data.parent || User.home
  }

  get filterItem() {
    return this.props.filterItem || filterItem
  }

  get results() {
    const filtered = this.filterItem(this.children, this.props.search)
    return filtered
  }
}

@view
class Item {
  render() {
    return this.props.children
  }
}

const generateRadialPositions = (count, radius, spread_angle, start_angle) => {
  let span = spread_angle < 360 ? 1 : 0
  let start = start_angle * Math.PI / 180
  let rad = spread_angle * Math.PI * 2 / 360 / (count - span)
  return [...Array(count)].map((_, i) => {
    return {
      x: -Math.cos(start + rad * i) * radius,
      y: -Math.sin(start + rad * i) * radius,
    }
  })
}

@view
class RadialMenu extends React.Component {
  static defaultProps = {
    itemRadius: 30,
    menuRadius: 100,
    spreadAngle: 360,
    startAngle: 0,
  }

  spots = [
    { x: 0, y: 0 },
    ...generateRadialPositions(
      this.props.items.length - 1,
      this.props.menuRadius,
      this.props.spreadAngle,
      this.props.startAngle
    ),
  ]

  render() {
    return this.spots.map((position, index) =>
      <Item key={index} position={position} />
    )
  }
}

@view({
  store: BarBrowseStore,
})
export default class BarBrowse {
  render({ store, onRef }) {
    onRef(this)

    const size = 450
    const slices = ['red', 'green', 'blue'] //, 2, 3, 4, 5]

    return (
      <orbit
        css={{
          width: size,
          height: size,
          //overflow: 'hidden',
          background: [0, 0, 0, 0.1],
          transform: {
            //scale: 0.2,
          },
        }}
      >
        <RadialMenu items={slices} />
      </orbit>
    )

    // return (
    //   <orbit>
    //     {items.map(index =>
    //       <item key={index} $position={{ index, total: items.length }}>
    //         <info>
    //           <planet $size={4} $color="blue" />
    //           <title>Issues</title>
    //         </info>
    //       </item>
    //     )}
    //   </orbit>
    // )

    // return (
    //   <div>
    //     {store.children &&
    //       store.children.map(child =>
    //         <child key={child.id}>
    //           {child.title}
    //         </child>
    //       )}
    //   </div>
    // )
  }

  static style = {
    orbit: {
      // flex: 1,
    },
    item: {
      background: 'white',
    },
    position: ({ index, total }) => {
      console.log(`${index * (360 / total)}deg`)
      return {
        transform: {
          rotate: `${index * (360 / total)}deg`,
        },
      }
    },
  }
}
