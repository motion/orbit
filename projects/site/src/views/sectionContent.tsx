import { view } from '@mcro/black'
import * as Constants from '../constants'

export const SectionContent = view({
  width: '100%',
  minWidth: Constants.smallSize,
  maxWidth: Constants.mediumSize,
  margin: [0, 'auto'],
  padding: [0, Constants.sidePad],
  position: 'relative',
  pointerEvents: 'none',
  '& > *': {
    pointerEvents: 'auto',
  },
  [Constants.screen.smallQuery]: {
    width: '100%',
    height: 'auto',
    minWidth: 'auto',
    maxWidth: 'auto',
    padding: [0, '5%'],
  },
  padHorizontal: {
    paddingLeft: Constants.sidePad,
    paddingRight: Constants.sidePad,
    [Constants.screen.smallQuery]: {
      paddingLeft: '5%',
      paddingRight: '5%',
    },
  },
}).theme(({ padding }) => ({
  paddingTop: padding !== true ? padding : 80,
  paddingBottom: padding !== true ? padding : 80,
}))
