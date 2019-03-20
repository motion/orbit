import { capitalize } from 'lodash'
import { EnumFilterOption, TableFilter, TableFilterEnum } from './types'

type PartialEnumFilter = Pick<EnumFilterOption, 'value'> & Partial<EnumFilterOption>

export function createEnumFilter(
  options: (string | PartialEnumFilter)[],
  filter?: Partial<TableFilterEnum>,
): TableFilter {
  return {
    type: 'enum',
    enum: options.map(partial => {
      let obj = typeof partial === 'string' ? { value: partial } : partial
      return {
        label: obj.label || capitalize(obj.value),
        value: obj.value,
        color: obj.color || null,
      }
    }),
    key: 'type',
    value: [],
    persistent: true,
    ...filter,
  }
}
