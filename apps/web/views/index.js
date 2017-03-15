import { view } from 'helpers'
import NotFound from './notfound'
import Layout from './layout'

@view
export default class Root {
  render() {
    const CurrentPage = this.router.activeView || NotFound
    return (
      <Layout $$flex>
        <CurrentPage />
      </Layout>
    )
  }
}
