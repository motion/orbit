/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */
export function makeStyleTag(): HTMLStyleElement | null {
  if (typeof document === 'undefined') {
    return null
  }
  const tag = document.createElement('style')
  tag.className = 'gloss-styles'
  tag.type = 'text/css'
  tag.appendChild(document.createTextNode(''))
  if (!document.head) throw 'expected head'
  document.head.appendChild(tag)
  return tag!
}
