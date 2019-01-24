import { ReactionRejectionError } from './constants'

// TODO make it a custom EnsureError

export function ensure(message: string, condition: boolean): condition is true {
  if (!condition) {
    throw new ReactionRejectionError(message)
  }
  return true
}
