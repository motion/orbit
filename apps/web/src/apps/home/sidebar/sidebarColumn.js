// @flow
import * as React from 'react'
import SidebarMain from './columns/sidebarMain'
import SidebarOther from './columns/sidebarOther'

const columns = {
  main: SidebarMain,
  other: SidebarOther,
}

export default class SidebarColumn extends React.Component {
  render({ data, navigate, paneProps }) {
    const Column = columns[data.type]
    return <Column data={data} navigate={navigate} paneProps={paneProps} />
  }
}
