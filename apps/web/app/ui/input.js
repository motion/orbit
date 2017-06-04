import React from 'react'
import { view } from '~/helpers'
import injectSegmented from './helpers/injectSegmented'
import injectForm from './helpers/injectForm'

const BORDER_RADIUS = 4

@injectForm
@injectSegmented
@view.ui
export default class Input {
  static defaultProps = {
    width: 'auto',
  }

  render() {
    const {
      dark,
      getRef,
      sync,
      segmented,
      form,
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
      height: 30,
      padding: [7, 8],
      border: [1, '#ddd'],
      width: 0,
      borderRadius: BORDER_RADIUS,
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
    segmented: ({ segmented: { first, last } }) => ({
      input: {
        boxShadow: [console.log(first, last), 'none'][1],
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: first ? 1 : 0,
        borderRadius: 'auto',
        borderLeftRadius: first ? BORDER_RADIUS : 0,
        borderRightRadius: last ? BORDER_RADIUS : 0,
        borderColor: last ? '#ddd' : '#eee',
        '&:focus': {
          background: '#fff',
        },
      },
    }),
  }
}
