export type IntegrationType =
  | 'slack'
  | 'gmail'
  | 'gdrive'
  | 'github'
  | 'jira'
  | 'confluence'

export type IntegrationTypeValues = {
  slack?: string
  gmail?: string
  gdrive?: string
  github?: string
  jira?: string
  confluence?: string
}