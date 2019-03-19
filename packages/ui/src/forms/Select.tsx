import { ThemeContext, View } from '@o/gloss'
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
      primary25: 'rgba(222, 235, 255, 0.15)',
    },
  }),
  light: theme => ({
    ...theme,
  }),
}

export function Select(props: Props) {
  const { activeThemeName } = useContext(ThemeContext)
  return (
    <View margin={[1, 1]} className="reset">
      <ReactSelect styles={selectStyles} theme={themes[activeThemeName]} {...props} />
    </View>
  )
}
