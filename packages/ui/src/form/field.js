// @flow
import React from 'react'
import { view } from '@mcro/black'
import Text from '../text'
import type { Color } from '@mcro/gloss'

// fields
import Input from './input'
import Select from './select'
import Toggle from './toggle'

const fields = {
  input: Input,
  select: Select,
  toggle: Toggle,
}

type Props = {
  type: 'input' | 'select' | 'toggle',
  spacing: number,
  row?: boolean,
  name?: string,
  placeholder?: string,
  placeholderColor?: Color,
  elementStyle?: Object,
  fieldStyle?: Object,
  labelStyle?: Object,
  elementProps?: Object,
  fieldProps?: Object,
  labelProps?: Object,
  element?: React$Children<any>,
}

@view.ui
export default class Field {
  props: Props

  static defaultProps = {
    type: 'input',
    width: 'auto',
    spacing: 1,
  }

  render({
    type,
    inactive,
    label,
    spacing,
    icon,
    width,
    iconProps,
    elementProps,
    name,
    labelProps,
    labelStyle,
    fieldStyle,
    elementStyle,
    onChange,
    defaultValue,
    sync,
    children,
    theme,
    row,
    chromeless,
    placeholder,
    placeholderColor,
    size,
    ...props
  }: Props) {
    const Element = fields[type]
    const id = `${Math.random()}`

    if (!Element && !children) {
      throw new Error('Invalid field type or no children given to Field')
    }

    return (
      <field $width={width} {...props}>
        <Text
          if={label}
          $label
          ellipse
          tagName="label"
          htmlFor={id}
          size={size}
          {...labelProps}
        >
          {label}
        </Text>
        <Element
          if={!children && Element}
          $element
          onChange={onChange}
          name={name || (label && label.toLowerCase()) || ''}
          defaultValue={defaultValue}
          sync={sync}
          theme={theme}
          chromeless={chromeless}
          placeholder={placeholder}
          placeholderColor={placeholderColor}
          borderRadius={0}
          size={size}
          {...elementProps}
        />
        {children}
      </field>
    )
  }

  static style = {
    field: {
      textAlign: 'left',
      alignItems: 'center',
      padding: 500,
    },
    label: {
      overflow: 'hidden',
      width: '100%',
    },
  }

  static theme = (props, theme) => {
    const inactiveStyle = {
      field: {
        opacity: 0.5,
        pointerEvents: 'none',
      },
    }

    const rowStyle = {
      field: {
        padding: [6, 8],
        flexFlow: 'row',
        alignItems: 'center',
      },
      label: {
        margin: 0,
        width: '30%',
        padding: [0, 10],
        textAlign: 'right',
      },
      element: {
        fontSize: 24,
        height: 40,
        border: 'none',
        borderBottom: [1, '#eee'],
        flex: 1,
      },
    }

    return {
      field: {
        ...(props.row && rowStyle.field),
        ...(props.inactive && inactiveStyle.field),
        ...props.fieldStyle,
      },
      element: {
        color: theme.base.color,
        ...(props.row && rowStyle.element),
        ...props.elementStyle,
      },
      label: {
        color: theme.base.color,
        ...(props.row && rowStyle.label),
        ...props.labelStyle,
      },
    }
  }
}
