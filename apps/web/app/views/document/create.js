// @flow
import React from 'react'
import { view } from '~/helpers'
import { Button, Icon } from '~/ui'
import Router from '~/router'
import Editor from '~/views/editor'
import Portal from 'react-portal'

@view
export default class Drawer {
  render() {
    return (
      <drawer>
        <content>
          <h1>hello</h1>
        </content>
      </drawer>
    )
  }

  static style = {
    drawer: {
      position: 'absolute',
      WebkitBackdropFilter: 'blur(10px)',
      zIndex: 10000,
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
    content: {
      margin: 50,
      background: 'blue',
    },
  }
}
