import { gloss, ThemeFn } from '@o/gloss'
import React, { forwardRef, useCallback, useContext } from 'react'
import { useThrottleFn } from '../hooks/useThrottleFn'
import { SizedSurface, SizedSurfaceProps } from '../SizedSurface'
import { DataType, Omit } from '../types'
import { FormContext } from './Form'

export type InputType =
  | 'input'
  | 'checkbox'
  | 'submit'
  | 'textarea'
  | 'password'
  | 'email'
  | 'select'
  | 'number'
  | DataType

export type InputProps = React.HTMLAttributes<HTMLInputElement> &
  Omit<SizedSurfaceProps, 'type'> & {
    step?: any
    value?: string
    onEnter?: Function
    type?: InputType
    name?: string
    form?: Object
    elementProps?: Object
    onClick?: Function
    forwardRef?: any
  }

export const Input = forwardRef(function Input(
  { onEnter, type = 'input', ...props }: InputProps,
  ref,
) {
  const context = useContext(FormContext)

  // update form context every so often, avoid too many re-renders
  const updateFormContext = useThrottleFn(
    (value: string) => {
      if (context) {
        context.dispatch({
          type: 'changeField',
          value: {
            name: props.name,
            value,
            type,
          },
        })
      }
    },
    { amount: 200 },
    [context, type, props.name],
  )

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
      updateFormContext(e.target.value)

      if (props.onChange) {
        props.onChange(e)
      }
      return () => {
        context.dispatch({ type: 'removeField', value: props.name })
      }
    },
    [props.name, props.onChange, context],
  )

  return (
    <SimpleInput
      forwardRef={ref}
      {...props}
      type={type}
      onKeyDown={onKeyDown}
      onChange={onChange}
    />
  )
})

const inputSurfaceTheme: ThemeFn = (props, theme) => ({
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

const SimpleInput = gloss((props: SizedSurfaceProps) => (
  <SizedSurface
    tagName="input"
    type="input"
    maxWidth="100%"
    alignItems="center"
    flexFlow="row"
    themeSelect="input"
    sizeFont
    sizePadding
    sizeHeight
    sizeLineHeight
    sizeRadius={0.75}
    noInnerElement
    label={props.name}
    glint={false}
    borderWidth={1}
    {...props}
    className={`ui-input ${props.className || ''}`}
  />
)).theme(inputSurfaceTheme)
