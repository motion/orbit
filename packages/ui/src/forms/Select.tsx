import { ThemeContext, View } from '@o/gloss'
import React, { useCallback, useContext } from 'react'
import ReactSelect from 'react-select'
import { Props } from 'react-select/lib/Select'
import { SimpleText } from '../text/SimpleText'
import { FormContext } from './Form'

const selectStyles = {
  option: provided => ({
    ...provided,
  }),
  menu: provided => ({
    ...provided,
    zIndex: 1000,
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

export type SelectProps = Props<{ value: string; label: string } | string>

export function Select({ minWidth, ...props }: SelectProps & { minWidth?: number }) {
  const { activeThemeName } = useContext(ThemeContext)
  const options = normalizeOptions(props.options)
  const context = useContext(FormContext)

  const onChange = useCallback(
    (items, action) => {
      if (!props.name) return
      if (!context) return
      console.log('got event', items, action)
      context.dispatch({
        type: 'changeField',
        value: {
          name: props.name,
          value: items,
          type: 'select',
        },
      })
      if (props.onChange) {
        props.onChange(items, action)
      }
      return () => {
        context.dispatch({ type: 'removeField', value: props.name })
      }
    },
    [props.name, props.onChange, context],
  )

  return (
    <View minWidth={minWidth || 100} flex={1} margin={1} className="reset">
      <SimpleText tagName="div">
        <ReactSelect
          styles={selectStyles}
          theme={themes[activeThemeName]}
          minMenuHeight={20}
          {...props}
          options={options}
          onChange={onChange}
        />
      </SimpleText>
    </View>
  )
}

function normalizeOptions(options: SelectProps['options']): { value: string; label: string }[] {
  if (options.some(x => typeof x === 'string')) {
    // @ts-ignore
    return options.map(x => (typeof x === 'string' ? { value: x, label: x } : x))
  }
  // @ts-ignore
  return options
}
