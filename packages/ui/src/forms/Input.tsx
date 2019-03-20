import React, { useCallback, useContext } from 'react'
import { UIContext, UIContextType } from '../helpers/contexts'
import { SizedSurface, SizedSurfaceProps } from '../SizedSurface'
import { GetSurfaceTheme } from '../Surface'
import { DataType } from '../types'
import { FormContext } from './Form'

export type InputType =
  | 'input'
  | 'checkbox'
  | 'submit'
  | 'textarea'
  | 'password'
  | 'email'
  | 'select'
  | DataType

export type InputProps = React.HTMLAttributes<HTMLInputElement> &
  SizedSurfaceProps & {
    value?: string
    onEnter?: Function
    type?: InputType
    name?: string
    form?: Object
    elementProps?: Object
    onClick?: Function
    forwardRef?: any
  }

type InputDecoratedProps = InputProps & {
  uiContext: UIContextType
}

export function InputPlain({ onEnter, type = 'input', ...props }: InputDecoratedProps) {
  const context = useContext(FormContext)
  const onKeyDown = useCallback(
    e => {
      if (e.keyCode === 13) {
        if (onEnter) {
          onEnter(e)
        }
      }
      if (props.onKeyDown) {
        props.onKeyDown(e)
      }
    },
    [props.onKeyDown, onEnter],
  )

  const onChange = useCallback(
    e => {
      if (context) {
        context.dispatch({
          type: 'changeField',
          value: {
            name: props.name,
            value: e.target.value,
            type: type,
          },
        })
      }
      if (props.onChange) {
        props.onChange(e)
      }
      return () => {
        context.dispatch({ type: 'removeField', value: props.name })
      }
    },
    [props.name, props.onChange, context],
  )

  return <SimpleInput {...props} type={type} onKeyDown={onKeyDown} onChange={onChange} />
}

function SimpleInput(props: SizedSurfaceProps) {
  return (
    <SizedSurface
      tagName="input"
      type="input"
      maxWidth="100%"
      alignItems="center"
      flexFlow="row"
      themeSelect="input"
      sizePadding
      sizeHeight
      sizeLineHeight
      sizeRadius={0.75}
      noInnerElement
      glint={false}
      borderWidth={1}
      {...props}
      className={`ui-input ${props.className || ''}`}
      getTheme={inputSurfaceTheme}
    />
  )
}

const inputSurfaceTheme: GetSurfaceTheme = (props, theme) => ({
  ...(!props.chromeless && {
    border: [1, theme.borderColor.desaturate(0.1)],
    '&:focus-within': {
      boxShadow: [[0, 0, 0, 3, theme.borderColor.alpha(a => a * 0.5)]],
    },
  }),
  '&::selection': {
    color: theme.color.lighten(0.1),
    background: theme.backgroundSelection || theme.background.darken(0.2),
  },
})

export const Input = React.forwardRef(function Input(props: InputProps, ref) {
  const uiContext = React.useContext(UIContext)
  return <InputPlain uiContext={uiContext} forwardRef={ref} {...props} />
})
