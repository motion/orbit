import { AppBit } from '@o/kit'
import { ConfluenceLoader } from './ConfluenceLoader'

export const ConfluenceApi = (app: AppBit) => {
  console.log('sending app:', app)
  return new ConfluenceLoader(app)
}
