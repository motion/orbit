import React from 'react'
import { view } from '~/helpers'

const BORDER_RADIUS = 3

@view
export default class Input {
  static defaultProps = {
    width: 'auto',
  }

  render() {
    const {
      dark,
      getRef,
      sync,
      first,
      last,
      segmented,
      noBorder,
      ...props
    } = this.props

    if (sync) {
      props.value = sync.get()
      props.onChange = e => sync.set(e.target.value)
    }

    return <input ref={getRef} {...props} />
  }

  static style = {
    input: {
      flex: 1,
      fontSize: 13,
      padding: [5, 8],
      border: [1, 'dotted', '#eee'],
      borderRadius: BORDER_RADIUS,
      lineHeight: '1rem',
      background: '#fff',
      alignSelf: 'center',
      outline: 0,
      '&:hover': {
        borderColor: '#ccc',
      },
      '&:focus': {
        borderColor: 'blue',
      },
    },
  }

  static theme = {
    noBorder: {
      input: {
        border: 'none',
      },
    },
    width: ({ width }) => ({
      input: {
        maxWidth: width,
      },
    }),
    segmented: ({ first, last }) => ({
      input: {
        boxShadow: 'none',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: last ? 1 : 0,
        borderLeftWidth: first ? 1 : 0,
        borderRadius: 'auto',
        borderTopRightRadius: first ? 0 : BORDER_RADIUS,
        borderBottomRightRadius: first ? 0 : BORDER_RADIUS,
        borderTopLeftRadius: last ? 0 : BORDER_RADIUS,
        borderBottomLeftRadius: last ? 0 : BORDER_RADIUS,
        '&:focus': {
          background: '#fff',
        },
      },
    }),
  }
}
