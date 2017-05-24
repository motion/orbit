import React from 'react'
import { view } from '~/helpers'

@view.ui
export default class DefinitionList {
  render() {
    const { object, children, ...props } = this.props
    const target = object || children
    const rows = Object.keys(target)

    return (
      <dl {...props}>
        {rows.map((item, i) => (
          <row key={`${item}${i}`}>
            <dt>{item}</dt>
            <dd>
              {typeof target[item] === 'object'
                ? JSON.stringify(target[item])
                : target[item]}
            </dd>
          </row>
        ))}
      </dl>
    )
  }

  static style = {
    dl: {
      padding: [5, 0],
    },
    row: {
      borderBottom: '1px dotted rgba(0,0,0,0.07)',
      flexFlow: 'row',
    },
    dt: {
      flex: 1,
      fontWeight: 500,
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    dd: {
      color: 'rgba(0,0,0,0.7)',
    },
  }
}
