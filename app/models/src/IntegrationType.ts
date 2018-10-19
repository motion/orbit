export type IntegrationType =
  | 'slack'
  | 'gmail'
  | 'drive'
  | 'github'
  | 'jira'
  | 'confluence'
  | 'website'

export type IntegrationTypeValues = {
  slack?: string
  gmail?: string
  drive?: string
  github?: string
  jira?: string
  confluence?: string
  website?: string
}
