// @flow
import * as React from 'react'
import { SidebarTitle } from '../helpers'

export default class DocSidebarStore {
  results = [
    {
      type: 'doc',
      isParent: true,
      result: this.props.result,
      display: <SidebarTitle {...this.props} />,
      onClick: this.props.onBack,
    },
  ]
}
