// @flow
import React from 'react'
import { view } from '@mcro/black'
import Text from '../text'
import type { Color } from '@mcro/gloss'

// fields
import Input from './input'
import Select from './select'
import Toggle from './toggle'
import Checkbox from './checkbox'

const fields = {
  input: Input,
  select: Select,
  toggle: Toggle,
  checkbox: Checkbox,
}

const TYPE_TO_ELEMENT_MAP = {
  password: 'input',
}

type Props = {
  type: 'input' | 'select' | 'toggle' | 'password' | 'checkbox',
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
    const Element = fields[TYPE_TO_ELEMENT_MAP[type] || type]
    const id =
      name ||
      (label && typeof label === 'string' && label.toLowerCase()) ||
      `element-${Math.round(Math.random() * 10000000)}`

    if (!Element && !children) {
      throw new Error('Invalid field type or no children given to Field')
    }

    return (
      <field $width={width} css={props}>
        <Text
          if={label}
          tagName="label"
          $label
          ellipse
          htmlFor={id}
          size={size}
          {...labelProps}
        >
          {label === true ? ' ' : label}
        </Text>
        <Element
          if={!children && Element}
          $element
          type={type}
          onChange={onChange}
          name={id}
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
        padding: [6, 0],
        flexFlow: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      label: {
        margin: 0,
        padding: [0, 10, 0, 0],
        flex: 'none',
        width: 'auto',
      },
      element: {
        fontSize: 24,
        height: 40,
        border: 'none',
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
