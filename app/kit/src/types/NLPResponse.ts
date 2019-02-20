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
  integrations: string[]
}
