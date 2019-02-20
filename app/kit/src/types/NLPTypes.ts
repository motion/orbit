export enum MarkType {
  Date = 'date',
  Integration = 'integration',
  Person = 'person',
  Type = 'type',
  Location = 'location',
}

export type Mark = [number, number, MarkType, string]

export type QueryFragment = {
  text: string
  type?: MarkType
}

export type DateRange = {
  startDate: Date | null
  endDate: Date | null
}
