import { CompiledTheme, ThemeContext, useTheme } from 'gloss'
import React, { useCallback, useContext, useMemo } from 'react'
import ReactSelect from 'react-select'
import { Props } from 'react-select/src/Select'
import { ActionMeta } from 'react-select/src/types'

import { ListItemSimple } from '../lists/ListItemSimple'
import { SimpleText } from '../text/SimpleText'
import { View } from '../View/View'
import { useParentForm } from './FormContext'

const selectStyles = (theme: CompiledTheme) => ({
  placeholder: provided => ({
    ...provided,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  }),
  option: provided => ({
    ...provided,
    padding: `4px 6px`,
    color: `${theme.color}`,
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
})

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

// copied from react-select because importing was not working
type BaseProps<SelectOption> = Omit<Props<SelectOption>, 'onChange' | 'isMulti'> & {
  minWidth?: number
}

// split out multi vs regular so onChange isn't a pain
export type SelectProps =
  | BaseProps<SelectOption> & {
      isMulti?: false
      onChange?: (value: SelectOption | null, action: ActionMeta) => any
    }
  | BaseProps<SelectOption> & {
      isMulti: true
      onChange?: (value: SelectOption[] | null, action: ActionMeta) => any
    }

export function Select({ minWidth, ...props }: SelectProps) {
  const theme = useTheme()
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
      formStore.changeValue(
        props.name,
        {
          value: items,
          type: 'select',
        },
        true,
      )
      return () => {
        formStore.removeField(props.name)
      }
    },
    [props.name, props.onChange, formStore],
  )

  const styles = useMemo(() => selectStyles(theme), [theme])

  return (
    <View
      // this is a very crude way to stop dragging in grids
      // we could do this better, but it would require some verbose context style solution
      onMouseDown={e => e.stopPropagation()}
      minWidth={minWidth || 100}
      flex={1}
      margin={1}
    >
      <SimpleText tagName="div">
        <ReactSelect
          styles={styles}
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
