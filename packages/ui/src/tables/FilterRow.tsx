/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */
import { PureComponent } from 'react'

import { textContent } from '../helpers/textContent'
import { TableFilter } from './types'


// import ContextMenu from '../ContextMenu'
// import { colors } from '../helpers/colors'

// const FilterText = gloss({
//   display: 'flex',
//   alignSelf: 'baseline',
//   userSelect: 'none',
//   cursor: 'pointer',
//   position: 'relative',
//   maxWidth: '100%',
//   '&:hover': {
//     color: colors.white,
//   },
//   '&:hover::after': {
//     content: '""',
//     position: 'absolute',
//     top: 3,
//     bottom: -2,
//     left: -6,
//     right: -6,
//     borderRadius: '999em',
//     backgroundColor: 'rgba(0, 0, 0, 0.3)',
//   },
//   '&:hover *': {
//     color: `${colors.white} !important`,
//     zIndex: 2,
//   },
// })

type Props = {
  children: any
  addFilter: (filter: TableFilter) => void
  filterKey: string
}

export default class FilterRow extends PureComponent {
  props: Props

  onClick = (e: MouseEvent) => {
    if (e.button === 0) {
      this.props.addFilter({
        type: e.metaKey || e.altKey ? 'exclude' : 'include',
        key: this.props.filterKey,
        value: textContent(this.props.children),
      })
    }
  }

  menuItems = [
    {
      label: 'Filter this value',
      click: () =>
        this.props.addFilter({
          type: 'include',
          key: this.props.filterKey,
          value: textContent(this.props.children),
        }),
    },
  ]

  render() {
    const { children /* , ...props */ } = this.props
    return children
    // return (
    //   <ContextMenu
    //     items={this.menuItems}
    //     component={FilterText}
    //     onClick={this.onClick}
    //     {...props}
    //   >
    //     {children}
    //   </ContextMenu>
    // )
  }
}
