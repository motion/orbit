import { view } from '~/helpers'
import { Input, Button, Link } from '~/views'
import NotFound from '~/pages/notfound'
import Router from '~/router'
import Sidebar from '~/views/layout/sidebar'

@view
export default class Root {
  prevent = e => e.preventDefault()

  render() {
    const CurrentPage = Router.activeView || NotFound

    return (
      <layout $$draggable>
        <CurrentPage key={Router.key} />
        <Sidebar />
      </layout>
    )
  }

  static style = {
    layout: {
      flex: 1,
      flexFlow: 'row',
    },
  }
}
