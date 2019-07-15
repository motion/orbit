import { DateRange, Mark, QueryFragment } from './NLPTypes'

export type NLPResponse = {
  query: string
  searchQuery: string
  marks: Mark[]
  parsedQuery: QueryFragment[]
  dates: string[]
  nouns: string[]
  date: DateRange
  startDate: Date | null
  endDate: Date | null
  people: string[]
  apps: string[]
}
