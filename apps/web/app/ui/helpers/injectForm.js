import { inject } from 'react-tunnel'

export default inject(provided => ({
  segmented: provided.ui && provided.ui.form,
}))
