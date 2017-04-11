import { view } from 'helpers'
import NotFound from './notfound'
import Layout from './layout'
import Router from '../stores/router'

@view
export default class Root {
  render() {
    const CurrentPage = Router.activeView || NotFound
    return (
      <Layout $$flex>
        <CurrentPage />
      </Layout>
    )
  }
}
