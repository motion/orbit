// @flow
import * as React from 'react'
import fuzzy_ from './fuzzy'

export const fuzzy = fuzzy_
export const Component = React.Component

class Cache {
  all: Set = new Set()
  add = (item: any) => this.all.add(item)
  remove = (item: any) => this.all.delete(item)
}
export const viewCache = new Cache()

import { HotKeys as OGHotKeys } from 'react-hotkeys'

// ensures it doesnt interrupt flexing
type Props = {
  style: any,
}

export const HotKeys = ({ style, ...props }: Props) => (
  <OGHotKeys
    style={{
      flex: 'inherit',
      flexFlow: 'inherit',
      flexGrow: 'inherit',
      ...style,
    }}
    {...props}
  />
)

import electron_, { OS as OS_ } from '~/helpers/electron'
export const electron = electron_
export const OS = OS_
