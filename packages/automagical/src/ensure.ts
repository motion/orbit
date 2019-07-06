import { ReactionRejectionError } from './constants'

// TODO make it a custom EnsureError

export function ensure(message: string, condition: boolean): condition is true {
  if (!condition) {
    throw new ReactionRejectionError(message)
  }
  return true
}

export function ensureExists<T>(message: string, condition: T | null | undefined): condition is T {
  if (condition === undefined || condition === null) {
    throw new ReactionRejectionError(message)
  }
  return true
}

export function ensureBlock(cb: Function) {
  try {
    cb()
  } catch (err) {
    if (err instanceof ReactionRejectionError) {
      return
    } else {
      throw err
    }
  }
}
