import { isDefined } from '@o/utils'
import { ThemeFn } from 'gloss'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'

import { isWebkit } from '../constants'
import { composeRefs } from '../helpers/composeRefs'
import { useThrottledFn } from '../hooks/useThrottleFn'
import { Surface, SurfaceProps } from '../Surface'
import { DataType } from '../types'
import { elevationTheme } from '../View/elevation'
import { useVisibility } from '../Visibility'
import { useParentForm } from './FormContext'

export type InputType =
  | 'text'
  | 'checkbox'
  | 'submit'
  | 'textarea'
  | 'password'
  | 'email'
  | 'select'
  | 'number'
  | DataType

export type InputProps = Omit<
  React.HTMLAttributes<HTMLInputElement>,
  'onDrag' | 'onDragEnd' | 'onDragStart'
> &
  Omit<SurfaceProps, 'type'> & {
    onEnter?: Function
    type?: InputType
    form?: Object
    step?: any
  }

export function Input({ onEnter, type = 'text', nodeRef, children, ...props }: InputProps) {
  const innerRef = useRef<HTMLInputElement>(null)
  const formStore = useParentForm()

  // update form context every so often, avoid too many re-renders
  const updateFormContext = useThrottledFn(
    (value: string) => {
      if (formStore) {
        formStore.changeValue(
          props.name,
          {
            value,
            type,
          },
          true,
        )
      }
    },
    { amount: 200 },
    [formStore, type, props.name],
  )

  useEffect(() => {
    if (isDefined(props.defaultValue)) {
      innerRef.current.value = `${props.defaultValue || ''}`
    }
  }, [props.defaultValue])

  return (
    <SimpleInput
      nodeRef={composeRefs(nodeRef, innerRef)}
      {...props}
      type={type}
      onKeyDown={useCallback(
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
      )}
      onChange={useCallback(
        e => {
          console.log('updating context right?', e.target['value'])
          updateFormContext((e.target as any).value)
          if (props.onChange) {
            props.onChange(e)
          }
        },
        [props.name, props.onChange, formStore],
      )}
    />
  )
}

const SimpleInput = ({
  placeholder,
  tagName = 'input',
  elementProps,
  name,
  type,
  value,
  onChange,
  onKeyDown,
  onKeyUp,
  onKeyPress,
  defaultValue,
  nodeRef,
  ...props
}: InputProps) => {
  const visible = useVisibility()
  return (
    // @ts-ignore
    <Surface
      tagName={tagName}
      elementProps={useMemo(
        () => ({
          nodeRef,
          placeholder,
          name,
          type,
          value,
          defaultValue,
          onChange,
          onKeyDown,
          onKeyUp,
          onKeyPress,
          ...elementProps,
        }),
        [nodeRef, value, defaultValue, placeholder, tagName, elementProps],
      )}
      elementTheme={inputElementTheme}
      type="input"
      maxWidth="100%"
      alignItems="center"
      flexDirection="row"
      subTheme="input"
      pointerEvents={visible ? 'inherit' : 'none'}
      sizeFont={0.9}
      sizePadding
      sizeHeight
      sizeLineHeight
      sizeRadius={0.75}
      label={name}
      activeStyle={null}
      glint={false}
      borderWidth={1}
      {...props}
      className={`ui-input ${props.className || ''}`}
      focusWithinStyle={inputSurfaceTheme}
    />
  )
}

const inputSurfaceTheme: ThemeFn<any> = props => {
  return {
    ...(!props.chromeless && {
      border: [1, props.borderColor],
      '&:focus-within': {
        // @ts-ignore
        boxShadow: [[0, 0, 0, 3, props.borderColorLight], elevationTheme(props as any).boxShadow],
      },
    }),
  }
}

const inputElementTheme: ThemeFn<InputProps> = props => {
  return {
    // apple selection color
    '&::selection': {
      color: props.colorLight,
      background: props.backgroundSelection || props.backgroundStronger,
    },
    // autofill keep proper color
    ...(isWebkit && {
      '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus': {
        WebkitTextFillColor: props.color,
        backgroundColor: 'transparent',
      },
    }),
  }
}
