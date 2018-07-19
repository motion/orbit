export const TYPES = {
  DATE: 'date',
  INTEGRATION: 'integration',
  PERSON: 'person',
  TYPE: 'type',
}

type Types = typeof TYPES
type TypeKey = keyof Types
type Mark = [number, number, TypeKey]
export type QueryFragment = { text: string; type?: TypeKey }

export type DateRange = {
  startDate?: Date
  endDate?: Date
}

export type NLPResponse = {
  query: string
  searchQuery: string
  marks: Mark[]
  parsedQuery: QueryFragment[]
  dates: string[]
  nouns: string[]
  date: DateRange
  startDate: Date
  endDate: Date
  people: string[]
}
