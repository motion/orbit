/* eslint-disable react/prop-types */
import { gloss } from 'gloss'

const Dot = gloss({
  position: 'absolute',
  cursor: 'pointer',
  width: 0,
  height: 0,
  borderColor: 'transparent',
  borderStyle: 'solid',
  borderTopWidth: 0,
  transform: 'translate(50%, 50%)',
}).theme(({ size, x, y, color }) => ({
  borderBottomColor: color,
  borderRightWidth: size / 2,
  borderBottomWidth: size / 2,
  borderLeftWidth: size / 2,
  marginLeft: x,
  marginTop: y,
}))

export default Dot
