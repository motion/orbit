// @flow
import { inject as injector } from '@mcro/react-tunnel'

// adds object fallback if not defined
export default function inject(mapProvidedToProps: Function) {
  return injector(props => mapProvidedToProps(props) || {})
}
