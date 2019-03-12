import { capitalize } from 'lodash'
import { guessTheme } from './presetTheme'
import { EnumFilterOption, EnumTableFilter, TableFilter } from './types'

type PartialEnumFilter = Pick<EnumFilterOption, 'value'> & Partial<EnumFilterOption>

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
        color: obj.color || (guessTheme[obj.value] ? guessTheme[obj.value].color : null) || null,
      }
    }),
    key: 'type',
    value: [],
    persistent: true,
    ...filter,
  }
}
