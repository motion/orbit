export class ReactionRejectionError extends Error {}
export class ReactionTimeoutError extends Error {}

export class Reaction {
  options = null
  reaction = null
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
