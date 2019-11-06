import { GlossView } from '../gloss'
import { GlossViewConfig } from '../types'

/**
 * We need to compile a few things to get the config right:
 *   1. get all the parents postProcessProps until:
 *   2. encounter a parent with getElement (and use that isDOMElement)
 *   3. stop there, don't keep going higher
 */
function compileConfig(
  config: GlossViewConfig | null,
  parent: GlossView | null,
): GlossViewConfig {
  const compiledConf: GlossViewConfig = { ...config }
  let cur = parent
  while (cur?.internal) {
    const parentConf = cur.internal.glossProps.config
    if (parentConf) {
      if (parentConf.postProcessProps) {
        // merge the postProcessProps
        const og = compiledConf.postProcessProps
        if (parentConf.postProcessProps !== og) {
          compiledConf.postProcessProps = og
            ? (a, b, c) => {
                og(a, b, c)
                parentConf.postProcessProps!(a, b, c)
              }
            : parentConf.postProcessProps
        }
      }
      // find the first getElement and break here
      if (parentConf.getElement) {
        compiledConf.getElement = parentConf.getElement
        compiledConf.isDOMElement = parentConf.isDOMElement
        break
      }
    }
    cur = cur.internal.parent
  }
  return compiledConf
}
