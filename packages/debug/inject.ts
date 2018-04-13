import debug from './debug'
import root from 'global'

if (!root.debug) {
  root.debug = debug
}
