import * as React from 'react'
import { view, compose } from '@mcro/black'
import { App } from '@mcro/stores'
import { logger } from '@mcro/logger'
import { AppWindow } from './AppWindow'

const log = logger('electron')

const decorator = compose(view.electron)

export const AppWindows = decorator(() => {
  const { appsState } = App
  log(`Rendering apps ${appsState.length}`)
  return appsState.map(({ id }, index) => {
    return <AppWindow key={id} id={id} isPeek={index === 0} />
  })
})
