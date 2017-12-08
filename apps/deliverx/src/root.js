import Router from '~/router'
import { view } from '@mcro/view'

@view
export default class Root {
  render() {
    const CurrentPage = Router.activeView
    return <CurrentPage key={Router.key} />
  }
}
