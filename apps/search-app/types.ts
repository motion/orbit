import { AppBit } from '@o/kit'

export type SearchAppFilter =
  | {
      type: 'date'
      value: {
        startDate?: string
        endDate?: string
      }
    }
  | {
      type: 'app'
      value: 'string'
    }
  | {
      type: 'content'
      value: 'person' | 'document' | 'email' | 'chat' | 'task' | 'wiki'
    }
  | {
      type: 'extras'
      value: 'showApps'
    }

export type SearchAppData = {
  enforcedFilters?: SearchAppFilter[]
  defaultSort?: 'recent' | 'relevant'
}

export type SearchApp = AppBit & { type: 'search'; data: SearchAppData }
