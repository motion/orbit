import { BLOCKS } from '/editor/constants'
import node from '/editor/node'
import AutoReplace from 'slate-auto-replace'

const hr = props => node(<hr {...props.attributes} />)

export default class Separators {
  nodes = {
    [BLOCKS.HR]: hr,
  }
  plugins = [
    // bullet
    AutoReplace({
      trigger: 'enter',
      before: /^(-{3})$/,
      transform: transform => {
        return transform.setBlock({
          type: 'hr',
          isVoid: true,
        })
      },
    }),
  ]
}
