import { AppType } from '@mcro/models'
import * as React from 'react'
import { GenericComponent } from '../types'
import { Title, VerticalSpace } from '../views'
import { Center } from '../views/Center'
import { Icon } from '../views/Icon'
import { AppProps } from './AppProps'
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
