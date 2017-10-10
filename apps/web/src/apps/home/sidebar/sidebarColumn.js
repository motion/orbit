// @flow
import * as React from 'react'
import SidebarMain from './columns/sidebarMain'
import SidebarOther from './columns/sidebarOther'

const columns = {
  main: SidebarMain,
  other: SidebarOther,
}

export default class SidebarColumn extends React.Component {
  render() {
    const { stackItem, navigate, paneProps } = this.props
    const Column = columns[stackItem.data.type]
    console.log('sidebarcolumn', stackItem, Column)
    return (
      <Column stackItem={stackItem} navigate={navigate} paneProps={paneProps} />
    )
  }
}
