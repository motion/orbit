/* eslint-disable react/prop-types */
import View from './View'
import { gloss } from 'gloss'

const Box = gloss(View, {
  flexDirection: 'column',

  outer: {
    alignSelf: 'flex-start',
    padding: 4,
  },
  fixed: {
    width: 6,
    height: 6,
  },
}).theme(
  p =>
    p.layout === 'row' && {
      flexDirection: 'row',
    },
  p => colors[p.color],
)

const colors = {
  0: {
    backgroundColor: '#14171A',
  },
  1: {
    backgroundColor: '#AAB8C2',
  },
  2: {
    backgroundColor: '#E6ECF0',
  },
  3: {
    backgroundColor: '#FFAD1F',
  },
  4: {
    backgroundColor: '#F45D22',
  },
  5: {
    backgroundColor: '#E0245E',
  },
}

export default Box
