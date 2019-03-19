import { DataType } from '../types'

export function getDataType(val: any): DataType {
  if (val instanceof Date) {
    return DataType.date
  }
  return DataType[typeof val] || DataType.unknown
}
