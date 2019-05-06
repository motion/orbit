import { om } from './om'

export * from './effects/openCurrentApp'

export const copyAppLink = () => {
  require('electron').clipboard.writeText(om.state.router.urlString)
}
