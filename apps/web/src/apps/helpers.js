import { isString } from 'lodash'

export const actionToKeyCode = action => {
  return (isString(action) ? action : action.name).toUpperCase().charCodeAt(0)
}
