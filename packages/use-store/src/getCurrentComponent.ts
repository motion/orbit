// @ts-ignore
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react'

const { ReactCurrentOwner } = __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED

export function getCurrentComponent() {
  return ReactCurrentOwner.current
}
