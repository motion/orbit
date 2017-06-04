import React from 'react'
import { view, inject } from '~/helpers'

@inject(context => context.ui)
@view.ui
export default class Input {
  static defaultProps = {
    width: 'auto',
    borderRadius: 5,
  }

  render() {
    const {
      dark,
      getRef,
      sync,
      inSegment,
      inForm,
      noBorder,
      borderRadius,
      ...props
    } = this.props

    if (sync) {
      props.value = sync.get()
      props.onChange = e => sync.set(e.target.value)
    }

    return <input $$borderRadius={borderRadius} ref={getRef} {...props} />
  }

  static style = {
    input: {
      flex: 1,
      fontSize: 13,
      height: 30,
      padding: [7, 8],
      border: [1, '#ddd'],
      width: 0,
      lineHeight: '1rem',
      background: '#fff',
      alignSelf: 'center',
      outline: 0,
      '&:focus': {
        background: 'red',
      },
      '&:hover': {
        borderColor: '#ccc',
      },
    },
  }

  static theme = {
    theme: () => ({
      button: {
        '&:focus': {
          borderColor: 'blue !important',
        },
      },
    }),
    noBorder: {
      input: {
        border: 'none',
      },
    },
    disabled: {
      input: {
        pointerEvents: 'none',
        opacity: 0.5,
      },
    },
    width: ({ width }) => ({
      input: {
        maxWidth: width,
      },
    }),
    inSegment: ({ borderRadius, inSegment: { first, last } }) => ({
      input: {
        background: 'red',
        boxShadow: [console.log(first, last), 'none'][1],
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: first ? 1 : 0,
        borderRadius: 'auto',
        borderLeftRadius: first ? borderRadius : 0,
        borderRightRadius: last ? borderRadius : 0,
        borderColor: last ? '#ddd' : '#eee',
        '&:focus': {
          background: '#fff',
        },
      },
    }),
  }
}
