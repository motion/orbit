import { AppBit } from '@o/kit'
import { JiraLoader } from './JiraLoader'

export const JiraApi = (app: AppBit) => {
  return new JiraLoader(app)
}
