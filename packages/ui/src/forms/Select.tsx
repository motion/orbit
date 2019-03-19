import { SimpleText, ThemeContext, View } from '@o/gloss'
import { Omit } from 'lodash'
import React, { useContext } from 'react'
import ReactSelect from 'react-select'
import { Props } from 'react-select/lib/Select'

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
  multiValue: provided => ({
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
      neutral0: '#111',
      neutral10: '#222',
      neutral20: '#333',
      neutral30: '#444',
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

export type SelectProps = Omit<Props, 'options'> & {
  options: { value: string; label: string }[] | string[]
}

export function Select({ minWidth, ...props }: SelectProps & { minWidth?: number }) {
  const { activeThemeName } = useContext(ThemeContext)
  const options = normalizeOptions(props.options)

  return (
    <View minWidth={minWidth || 100} flex={1} margin={1} className="reset">
      <SimpleText tagName="div">
        <ReactSelect
          styles={selectStyles}
          theme={themes[activeThemeName]}
          minMenuHeight={20}
          {...props}
          options={options}
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
