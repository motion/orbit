import { inject } from 'react-tunnel'

export default inject(provided => ({
  segmented: provided.uiSegment,
}))
