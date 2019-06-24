import { gloss } from 'gloss'
import React, { PureComponent } from 'react'

import { DataDescription } from './DataDescription'
import { DataValueExtractor, InspectorName } from './DataInspectorControlled'
import { getSortedKeys } from './utils'

/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

const PreviewContainer = gloss('span', {
  fontStyle: 'italic',
})

function intersperse(arr, sep) {
  if (arr.length === 0) {
    return []
  }
  return arr.slice(1).reduce((xs, x) => xs.concat([sep, x]), [arr[0]])
}

export class DataPreview extends PureComponent<{
  type: string
  value: any
  depth: number
  extractValue: DataValueExtractor
  maxProperties: number
}> {
  static defaultProps = {
    maxProperties: 5,
  }

  render() {
    const { depth, extractValue, type, value } = this.props

    if (type === 'array') {
      return (
        <PreviewContainer>
          {'['}
          {intersperse(
            value.map((element, index) => {
              const res = extractValue(element, depth + 1)
              if (!res) {
                return null
              }

              const { type, value } = res
              return <DataDescription key={index} type={type} value={value} />
            }),
            ', ',
          )}
          {']'}
        </PreviewContainer>
      )
    } else if (type === 'date') {
      return <span>{value.toString()}</span>
    } else if (type === 'object') {
      const propertyNodes: React.ReactElement[] = []

      const keys = getSortedKeys(value)
      let i = 0
      for (const key of keys) {
        let ellipsis
        i++
        if (i >= this.props.maxProperties) {
          ellipsis = <span key={'ellipsis'}>…</span>
        }

        propertyNodes.push(
          <span key={key}>
            <InspectorName>{key}</InspectorName>
            {ellipsis}
          </span>,
        )

        if (ellipsis) {
          break
        }
      }

      return (
        <PreviewContainer>
          {'{'}
          {intersperse(propertyNodes, ', ')}
          {'}'}
        </PreviewContainer>
      )
    } else {
      return null
    }
  }
}
