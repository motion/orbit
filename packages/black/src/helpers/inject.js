import { inject as injector } from 'react-tunnel'

// adds object fallback if not defined
export default function inject(mapProvidedToProps: Function) {
  return injector(props => mapProvidedToProps(props) || {})
}
