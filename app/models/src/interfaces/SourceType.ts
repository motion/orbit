export type SourceType =
  | 'slack'
  | 'gmail'
  | 'drive'
  | 'github'
  | 'jira'
  | 'confluence'
  | 'website'
  | 'pinned'

export type SourceTypeValues = {
  slack?: string
  gmail?: string
  drive?: string
  github?: string
  jira?: string
  confluence?: string
  website?: string
  pinned?: string
}
