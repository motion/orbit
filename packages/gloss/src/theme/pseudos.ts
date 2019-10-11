export const pseudos = {
  hover: {
    pseudoKey: '&:hover',
    postfix: 'Hover',
    forceOnProp: 'hover',
    prop: 'hoverStyle',
  },
  focus: {
    pseudoKey: '&:focus',
    postfix: 'Focus',
    forceOnProp: 'focus',
    prop: 'focusStyle',
  },
  focusWithin: {
    pseudoKey: '&:focus-within',
    postfix: 'FocusWithin',
    forceOnProp: 'focusWithin',
    prop: 'focusWithinStyle',
  },
  active: {
    pseudoKey: '&:active',
    postfix: 'Active',
    forceOnProp: 'active',
    prop: 'activeStyle',
  },
  disabled: {
    pseudoKey: '&:disabled',
    postfix: 'Disabled',
    forceOnProp: 'disabled',
    prop: 'disabledStyle',
  },
  selected: {
    pseudoKey: undefined,
    postfix: 'Selected',
    forceOnProp: 'selected',
    prop: 'selectedStyle',
  },
} as const

// { activeStyle: '&:active', ... }
export const pseudoProps = Object.keys(pseudos).reduce((acc, key) => {
  acc[pseudos[key].prop] = pseudos[key].pseudoKey
  return acc
}, {})
