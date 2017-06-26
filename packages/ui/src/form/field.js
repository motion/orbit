// @flow
import React from 'react'
import { view } from '@jot/black'
import Icon from '../icon'
import Ellipse from '../ellipse'
import type { Color } from 'gloss'

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
  spaced?: boolean,
  row?: boolean,
  placeholder?: string,
  placeholderColor?: Color,
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
    fieldProps,
    labelProps,
    onChange,
    defaultValue,
    sync,
    children,
    sub,
    theme,
    spaced,
    row,
    chromeless,
    placeholder,
    placeholderColor,
    ...props
  }: Props) {
    const Element = fields[type]
    const id = `${Math.random()}`

    if (!Element && !children) {
      throw new Error(`Invalid field type or no children given to Field`)
    }

    return (
      <field $width={width} {...props}>
        <label if={label} htmlFor={id} {...labelProps}>
          <Icon
            if={icon}
            name={icon}
            size={14}
            margin={[0, 5, 0, 0]}
            color={[255, 255, 255, 0.3]}
            theme={theme}
            {...iconProps}
          />
          <Ellipse>
            {label}
          </Ellipse>
        </label>
        <Element
          if={Element}
          $element
          onChange={onChange}
          defaultValue={defaultValue}
          sync={sync}
          theme={theme}
          chromeless={chromeless}
          placeholder={placeholder}
          placeholderColor={placeholderColor}
          {...fieldProps}
        />
        {children}
      </field>
    )
  }

  static style = {
    field: {
      padding: [10],
      textAlign: 'left',
    },
    label: {
      overflow: 'hidden',
      width: '100%',
      userSelect: 'none',
      fontSize: 13,
      textTransform: 'uppercase',
      color: [0, 0, 0, 0.5],
      padding: [5, 10],
      borderBottom: [1, '#333'],
      margin: [0, 0, 10],
    },
    width: width => ({ width }),
  }

  static theme = {
    theme: (props, _, theme) => ({
      element: {
        color: theme.base.color,
      },
      label: {
        color: theme.base.color,
      },
    }),
    row: {
      field: {
        padding: [5, 5],
        flexFlow: 'row',
        alignItems: 'flex-end',
        // justifyContent: 'space-between',
      },
      label: {
        margin: 0,
        padding: 10,
        width: '30%',
        minWidth: 120,
        borderBottom: 'none',
        textAlign: 'right',
      },
      element: {
        fontSize: 24,
        height: 40,
        border: 'none',
        borderBottom: [1, '#eee'],
        flex: 1,
      },
    },
    inactive: {
      field: {
        opacity: 0.5,
        pointerEvents: 'none',
      },
    },
    sub: {
      field: {
        paddingLeft: 10,
      },
      label: {
        fontSize: 12,
        opacity: 0.6,
        flex: 1,
      },
    },
    spaced: {
      field: {
        marginBottom: 10,
      },
    },
  }
}
