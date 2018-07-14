import * as React from 'react'
import { view, attachTheme } from '@mcro/black'
import { Label } from './label'
import { ListRow } from '../ListRow'

// fields
import { Input } from './input'
import { Select } from './select'
import { Toggle } from './toggle'
import { Checkbox } from './checkbox'

const fields = {
  input: Input,
  select: Select,
  toggle: Toggle,
  checkbox: Checkbox,
  textarea: props => <Input sizeHeight={false} {...props} />,
}

const TYPE_TO_ELEMENT_MAP = {
  password: 'input',
}

// type Props = {
//   type: 'input' | 'select' | 'toggle' | 'password' | 'checkbox' | 'textarea',
//   spacing: number,
//   row?: boolean,
//   name?: string,
//   label?: string,
//   placeholder?: string,
//   placeholderColor?: Color,
//   elementStyle?: Object,
//   fieldStyle?: Object,
//   labelStyle?: Object,
//   elementProps?: Object,
//   fieldProps?: Object,
//   labelProps?: Object,
//   element?: React$Element<any>,
// }

@attachTheme
@view.ui
export class Field extends React.Component {
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
    value,
    size,
    ...props
  }) {
    const Element = fields[TYPE_TO_ELEMENT_MAP[type] || type]
    const id =
      name ||
      (label && typeof label === 'string' && label.toLowerCase()) ||
      `element-${Math.round(Math.random() * 10000000)}`
    if (!Element && !children) {
      throw new Error('Invalid field type or no children given to Field')
    }
    const contents = (
      <>
        <Label if={label} $label htmlFor={id} size={size} {...labelProps}>
          {label === true ? ' ' : label}
        </Label>
        <Element
          if={!children && Element}
          $element
          type={type}
          onChange={onChange}
          name={id}
          defaultValue={defaultValue}
          value={value}
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
      </>
    )
    if (row) {
      return <ListRow $field>{contents}</ListRow>
    }
    return (
      <div $field css={props}>
        {contents}
      </div>
    )
  }

  static style = {
    field: {
      textAlign: 'left',
    },
    label: {
      overflow: 'hidden',
      padding: [10, 0, 10, 0],
    },
  }

  static theme = ({ theme, ...props }) => {
    const inactiveStyle = {
      field: {
        opacity: 0.5,
        pointerEvents: 'none',
      },
    }

    const rowStyle = {
      label: {
        margin: 0,
        padding: [0, 10],
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
        width: props.width,
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
