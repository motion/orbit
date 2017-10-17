// @flow
import view_ from './view'
import store_ from './store'
import ProvideStore_ from './provideStore'

export log from './helpers/log'
export watch from './helpers/watch'

export const view = view_
export const store = store_
export const ProvideStore = ProvideStore_

// constants
import * as Constants_ from './constants'
export const Constants = Constants_

import * as React from 'react'
export const { Component } = React
