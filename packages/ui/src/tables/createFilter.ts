import { capitalize } from 'lodash'

import { EnumFilterOption, TableFilter, TableFilterEnum } from './types'

type PartialEnumFilter = Pick<EnumFilterOption, 'value'> & Partial<EnumFilterOption>

export function createEnumFilter(
  options: (string | PartialEnumFilter)[],
  defaultOptions?: Partial<TableFilterEnum>,
): TableFilter {
  return {
    key: 'type',
    value: [],
    persistent: true,
    ...defaultOptions,
    type: 'enum',
    enum: normalizeEnum(options),
  }
}

function normalizeEnum(options: (string | Partial<any>)[]) {
  return options.map(partial => {
    let obj = typeof partial === 'string' ? { value: partial } : partial
    return {
      label: obj.label || capitalize(obj.value),
      value: obj.value,
      color: obj.color || null,
    }
  })
}
