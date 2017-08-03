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

@view({
  store: BarBrowseStore,
})
export default class BarBrowse {
  render({ store, onRef }) {
    onRef(this)

    const size = 450
    const items = [1, 2, 3]
    const width = size / 2
    const height = size / 2
    const hypotenuse = Math.sqrt(width * width + height * height)
    const ratio = height / width
    const rotate = Math.atan(ratio) * 57.5

    console.log(width, height, hypotenuse, ratio, rotate)

    return (
      <orbit
        css={{
          width: size,
          height: size,
          overflow: 'hidden',
          background: 'yellow',
        }}
      >
        <thing
          css={{
            position: 'absolute',
            top: 0,
            right: 0,
            width,
            height,
            background: 'rgba(0, 0, 255, 0.2)',
            overflow: 'hidden',
            transform: {
              rotate: '90deg',
            },
          }}
        >
          <otherthing
            css={{
              background: 'rgba(255, 0, 0, 0.2)',
              width: hypotenuse,
              marginLeft: width - hypotenuse,
              height,
              transformOrigin: 'right bottom',
              transform: {
                rotate: `${rotate}deg`,
              },
              overflow: 'hidden',
            }}
          >
            <content
              css={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                textAlign: 'center',
                transform: { rotate: `-${rotate}deg` },
                fontSize: 10,
                background: 'blue',
              }}
            >
              testasdasdasdsad
            </content>
          </otherthing>
        </thing>
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
