// this fixed node complaining about throwing when we created SHARED_REJECTION_ERROR
class CustomError {
  message = ''
  constructor(message?: string) {
    this.message = message || ''
  }
}

export class ReactionRejectionError extends CustomError {}
export class ReactionTimeoutError extends CustomError {}

export class Reaction {
  options = null
  reaction: [any, any] | null = null
  constructor(a, b, c) {
    if (!b || typeof b === 'object') {
      // watch
      this.reaction = a
      this.options = b
    } else {
      // react
      this.reaction = [a, b]
      this.options = c
    }
  }
}
