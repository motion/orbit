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

type App = {
  index?: GenericComponent<AppProps>
  main: GenericComponent<AppProps>
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
}
