// @flow
import * as React from 'react'
import { SidebarTitle } from '../helpers'

export default class DocSidebar {
  results = [
    {
      type: 'doc',
      isParent: true,
      result: this.props.result,
      children: <SidebarTitle {...this.props} />,
      displayTitle: false,
      title: this.props.result.title,
      onClick: this.props.onBack,
    },
  ]
}
