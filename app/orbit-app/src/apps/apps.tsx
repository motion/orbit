import * as React from 'react'
import { AppType } from '@mcro/models'
import { AppProps } from './AppProps'
import { GenericComponent } from '../types'
import { lists } from './lists'
import { topics } from './topics'
import { people } from './people/people'
import { search } from './search'
import { bit } from './bit'
import { home } from './home'
import { sources } from './sources'
import { settings } from './settings'
import { Center } from '../views/Center'
import { Title, VerticalSpace } from '../views'
import { Icon } from '../views/Icon'

type App = {
  index?: GenericComponent<AppProps<any>>
  main: GenericComponent<AppProps<any>>
}

type AppsIndex = { [key in AppType]: App }

export const apps: AppsIndex = {
  search,
  people,
  topics,
  lists,
  sources,
  settings,
  bit,
  home,
  message: {
    main: props => (
      <Center>
        {props.appConfig.data.icon ? <Icon name={props.appConfig.data.icon} size={32} /> : null}
        <VerticalSpace />
        <Title>{props.appConfig.title}</Title>
      </Center>
    ),
    index: () => <div>empty main</div>,
  },
}
