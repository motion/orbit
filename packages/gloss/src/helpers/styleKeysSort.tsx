import { Config } from '../configureGloss'

/**
 * Sorts styles so the pseudo keys go in their logical override
 */

export const styleKeysSort = (a: string, b: string) =>
  styleKeyScore(a) > styleKeyScore(b) ? 1 : -1

// keeps priority of hover/active/focus as expected
let mediaQueriesImportance = {}
let hasSetupMediaQueryKeys = false

const styleKeyScore = (x: string) => {
  let psuedoScore = 0
  if (x[0] === '&') {
    const hasFocus = x === '&:focus' ? 1 : 0
    const hasHover = x === '&:hover' ? 2 : 0
    const hasActive = x === '&:active' ? 3 : 0
    const hasDisabled = x === '&:disabled' ? 4 : 0
    psuedoScore += hasActive + hasHover + hasFocus + hasDisabled
  }
  if (psuedoScore) {
    return psuedoScore
  }
  // media query sort by the order they gave us in object
  if (Config.mediaQueries) {
    if (!hasSetupMediaQueryKeys) {
      hasSetupMediaQueryKeys = true
      for (const [index, key] of Object.keys(Config.mediaQueries).entries()) {
        // most important to least important
        mediaQueriesImportance[Config.mediaQueries[key]] = 10000 - index
      }
    }
    if (x in mediaQueriesImportance) {
      return mediaQueriesImportance[x]
    }
  }
  return 0
}
