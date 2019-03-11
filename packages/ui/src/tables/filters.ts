import { capitalize } from 'lodash'
import { EnumFilterOption, EnumTableFilter, TableFilter } from './types'

type PartialEnumFilter = Pick<EnumFilterOption, 'value'> & Partial<EnumFilterOption>

const guessColor = {
  fail: 'red',
  failure: 'red',
  fatal: 'red',
  error: 'red',
  warn: 'yellow',
  warning: 'yellow',
  alert: 'yellow',
  success: 'green',
  valid: 'green',
  pass: 'green',
  ok: 'green',
  debug: 'orange',
  verbose: 'grey',
}

export function createEnumFilter(
  options: (string | PartialEnumFilter)[],
  filter?: Partial<EnumTableFilter>,
): TableFilter {
  return {
    type: 'enum',
    enum: options.map(partial => {
      let obj = typeof partial === 'string' ? { value: partial } : partial
      return {
        label: obj.label || capitalize(obj.value),
        value: obj.value,
        color: obj.color || guessColor[obj.value] || 'transparent',
      }
    }),
    key: 'type',
    value: [],
    persistent: true,
    ...filter,
  }
}
