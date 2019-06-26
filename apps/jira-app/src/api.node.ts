import { AppBit } from '@o/kit'
import { JiraLoader } from './JiraLoader'

export default (app: AppBit) => {
  return new JiraLoader(app)
}
