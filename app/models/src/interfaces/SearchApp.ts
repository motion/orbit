import { BaseApp } from './App'

export type SearchAppFilter =
  | {
      type: 'date'
      value: {
        startDate?: string
        endDate?: string
      }
    }
  | {
      type: 'integration'
      value: 'string'
    }
  | {
      type: 'content'
      value: 'person' | 'document' | 'email' | 'chat' | 'task' | 'wiki'
    }

export type SearchAppData = {
  enforcedFilters?: SearchAppFilter[]
  defaultSort?: 'recent' | 'relevant'
}

export type SearchApp = BaseApp & { type: 'search'; data: SearchAppData }
