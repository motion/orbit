import { view } from 'helpers'
import App from '../stores/app'
import Router from '../stores/router'
import NotFound from './notfound'

@view
export default class Root {
  render() {
    const CurrentPage = Router.activeView || NotFound
    return (
      <Layout page={CurrentPage} $$flex>
        <CurrentPage />
      </Layout>
    )
  }
}
