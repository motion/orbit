// @flow
import React from 'react'
import { view } from '@jot/black'
import { clr, inject } from '~/helpers'
import type { Color } from 'gloss'

export type Props = {
  getRef?: Function,
  sync?: Function,
  inForm?: boolean,
  noBorder?: boolean,
  transparent?: boolean,
  borderRadius?: number,
  flex?: number | string,
  borderColor?: Color,
}

@inject(context => context.ui)
@view.ui
export default class Input {
  static defaultProps = {
    width: 'auto',
    borderRadius: 5,
  }

  render({
    getRef,
    sync,
    inSegment,
    inForm,
    noBorder,
    borderRadius,
    flex,
    transparent,
    borderColor,
    ...props
  }: Props) {
    if (sync) {
      props.value = sync.get()
      props.onChange = e => sync.set(e.target.value)
    }

    return <input $$borderRadius={borderRadius} ref={getRef} {...props} />
  }

  static style = {
    input: {
      fontSize: 13,
      lineHeight: '1rem',
      alignSelf: 'center',
      outline: 0,
    },
  }

  static theme = {
    theme: (
      { borderColor, fontSize, transparent, height, type },
      context,
      theme
    ) => {
      let styles = {}

      if (!type || type === 'password' || type === 'text') {
        styles = {
          height: height || 30,
          minHeight: height || 30,
          padding: [7, 8],
          width: '100%',
          border: [1, theme.base.borderColor],
        }
      }

      return {
        input: {
          fontSize,
          ...theme.base,
          borderColor: borderColor || theme.base.borderColor,
          height,
          minHeight: height,
          ...styles,
          ...(transparent && { background: 'transparent' }),
          '&:hover': {
            borderColor: theme.hover.borderColor,
          },
          '&:focus': {
            borderColor: clr(theme.focus.borderColor).alpha(0.2),
            borderWidth: 1,
          },
        },
      }
    },
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
    inSegment: ({ borderRadius, inSegment: { first, last } }, _, theme) => ({
      input: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: first ? 1 : 0,
        borderRadius: 'auto',
        borderLeftRadius: first ? borderRadius : 0,
        borderRightRadius: last ? borderRadius : 0,
        borderColor: last
          ? theme.base.borderColor
          : theme.base.borderColorLight,
        '&:focus': theme.focus,
      },
    }),
  }
}
