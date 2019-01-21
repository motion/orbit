import { AppType } from '@mcro/models'
import * as React from 'react'
import { memoIsEqualDeep } from '../helpers/memoIsEqualDeep'
import { GenericComponent } from '../types'
import { Title, VerticalSpace } from '../views'
import { Center } from '../views/Center'
import { Icon } from '../views/Icon'
import { AppProps } from './AppProps'
import { apps as appsApps } from './apps/index'
import { bit } from './bit'
import { home } from './home'
import { lists } from './lists'
import { people } from './people/people'
import { search } from './search'
import { settings } from './settings'
import { sources } from './sources'
import { topics } from './topics'

type App = {
  index?: GenericComponent<AppProps<any>>
  main: GenericComponent<AppProps<any>>
}

type AppsIndex = { [key in AppType]: App }

export const apps = memoizeAll({
  search,
  people,
  topics,
  lists,
  sources,
  settings,
  bit,
  home,
  apps: appsApps,
  message: {
    main: props => (
      <Center>
        <Title size={2.5}>{props.appConfig.title}</Title>
        <VerticalSpace />
        {props.appConfig.data.icon ? <Icon name={props.appConfig.data.icon} size={64} /> : null}
      </Center>
    ),
    index: () => <div>empty main</div>,
  },
}) as AppsIndex

function memoizeAll(apps) {
  const res = {}
  for (const key in apps) {
    res[key] = {
      main: memoIsEqualDeep(apps[key].main),
      index: memoIsEqualDeep(apps[key].index),
    }
  }
  return res
}

console.log('apps', apps)
