import { AppBit } from '@o/kit'
import { ConfluenceLoader } from './ConfluenceLoader'

export default (app: AppBit) => {
  console.log('sending app:', app)
  return new ConfluenceLoader(app)
}
