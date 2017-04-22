import { view } from '~/helpers'
import { Input, Button, Link } from '~/views'
import NotFound from '~/pages/notfound'
import Router from '~/router'

@view
export default class Root {
  prevent = e => e.preventDefault()

  render() {
    const CurrentPage = Router.activeView || NotFound

    return (
      <layout $$flex>
        <CurrentPage key={Router.key} />
      </layout>
    )
  }
}
