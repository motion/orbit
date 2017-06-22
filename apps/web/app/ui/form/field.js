// @flow
import React from 'react'
import { view } from '@jot/black'
import Icon from '../icon'
import Ellipse from '../ellipse'

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
}

@view.ui
export default class Field {
  props: Props

  static defaultProps = {
    width: 'auto',
    spacing: 1,
  }

  render() {
    const {
      type,
      inactive,
      label,
      spacing,
      icon,
      width,
      iconProps,
      elementProps,
      labelProps,
      onChange,
      defaultValue,
      sync,
      children,
      sub,
      theme,
      spaced,
      ...props
    } = this.props

    const Element = fields[type]
    const id = `${Math.random()}`

    if (!Element && !children) {
      throw new Error(`Invalid field type or no children given to Field`)
    }

    return (
      <field $width={width} {...props}>
        <label if={label} htmlFor={id} {...labelProps}>
          <Ellipse>
            {label}
          </Ellipse>
        </label>
        <Icon
          if={icon}
          name={icon}
          size={14}
          margin={[0, 5, 0, 0]}
          color={[255, 255, 255, 0.3]}
          theme={theme}
          {...iconProps}
        />
        <Element
          if={Element}
          onChange={onChange}
          defaultValue={defaultValue}
          sync={sync}
          theme={theme}
          {...elementProps}
        />
        {children}
      </field>
    )
  }

  static style = {
    field: {
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: [0, 5],
    },
    label: {
      overflow: 'hidden',
      flex: 4,
      padding: [0, 5, 0, 0],
      userSelect: 'none',
    },
    width: width => ({ width }),
  }

  static theme = {
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
