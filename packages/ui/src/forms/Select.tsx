import { ThemeContext } from 'gloss'
import React, { useCallback, useContext } from 'react'
import ReactSelect from 'react-select'
import { Props } from 'react-select/lib/Select'
import { ActionMeta } from 'react-select/lib/types'

import { ListItemSimple } from '../lists/ListItemSimple'
import { SimpleText } from '../text/SimpleText'
import { Omit } from '../types'
import { View } from '../View/View'
import { useParentForm } from './Form'

const selectStyles = {
  placeholder: provided => ({
    ...provided,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  }),
  option: provided => ({
    ...provided,
    padding: 0,
  }),
  menuPortal: provided => ({
    ...provided,
    zIndex: 10000000000000,
    pointerEvents: 'auto',
  }),
  menu: provided => ({
    ...provided,
    margin: '1px 0 0',
    borderRadius: 0,
  }),
  dropdownIndicator: provided => ({
    ...provided,
    padding: 4,
  }),
  clearIndicator: provided => ({
    ...provided,
    padding: 4,
  }),
  multiValueLabel: provided => ({
    ...provided,
    padding: 1,
  }),
  control: provided => ({
    ...provided,
    minHeight: 28,
  }),
  container: provided => ({
    ...provided,
    // padding: 0,
  }),
  valueContainer: provided => ({
    ...provided,
    padding: `0px 4px`,
  }),
}

const themes = {
  dark: theme => ({
    ...theme,
    colors: {
      ...theme.colors,
      neutral0: '#292929',
      neutral10: '#353535',
      neutral20: '#444',
      neutral30: '#555',
      neutral50: '#666',
      neutral60: '#777',
      neutral70: '#888',
      neutral80: '#999',
      neutral90: '#aaa',
      primary: 'rgb(28, 102, 205)',
      primary25: 'rgba(222, 235, 255, 0.15)',
      primary50: 'rgba(222, 235, 255, 0.2)',
    },
  }),
  light: theme => ({
    ...theme,
  }),
}

type SelectOption = { label: string; value: any }

type BaseProps = Omit<Props<SelectOption>, 'onChange' | 'isMulti'> & {
  minWidth?: number
}

// split out multi vs regular so onChange isn't a pain
export type SelectProps =
  | BaseProps & {
      isMulti?: false
      onChange?: (value: SelectOption | null, action: ActionMeta) => any
    }
  | BaseProps & {
      isMulti: true
      onChange?: (value: SelectOption[] | null, action: ActionMeta) => any
    }

export function Select({ minWidth, ...props }: SelectProps) {
  const { activeThemeName } = useContext(ThemeContext)
  const options = normalizeOptions(props.options)
  const formStore = useParentForm()

  const onChange = useCallback(
    (items, action) => {
      if (props.onChange) {
        props.onChange(items, action)
      }
      if (!props.name) return
      if (!formStore) return
      formStore.changeField({
        name: props.name,
        value: items,
        type: 'select',
      })
      return () => {
        formStore.removeField(props.name)
      }
    },
    [props.name, props.onChange, formStore],
  )

  return (
    <View
      // this is a very crude way to stop dragging in grids
      // we could do this better, but it would require some verbose context style solution
      onMouseDown={e => e.stopPropagation()}
      minWidth={minWidth || 100}
      flex={1}
      margin={1}
      className="reset"
    >
      <SimpleText tagName="div">
        <ReactSelect
          styles={selectStyles}
          theme={themes[activeThemeName]}
          minMenuHeight={20}
          menuPortalTarget={document.body}
          escapeClearsValue
          isClearable
          {...props}
          components={{
            components,
            ...props.components,
          }}
          options={options}
          onChange={onChange}
        />
      </SimpleText>
    </View>
  )
}

const components = {
  Option: ({ data, ...rest }) => <ListItemSimple title={data.label} {...rest} />,
  SingleValue: ({ data, ...rest }) => <ListItemSimple title={data.label} {...rest} />,
}

function normalizeOptions(options: SelectProps['options']): { value: string; label: string }[] {
  if (options.some(x => typeof x === 'string')) {
    return options.map(x => (typeof x === 'string' ? { value: x, label: x } : x))
  }
  return options
}
