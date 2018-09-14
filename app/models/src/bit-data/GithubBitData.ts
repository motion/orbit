export interface GithubBitData {
  closed: boolean
  body: string
  labels: GithubBitDataLabel[]
  author: GithubBitDataUser
  assignees: GithubBitDataUser[]
  comments: GithubBitDataComment[]
}

export interface GithubBitDataLabel {
  name: string
  description: string
  color: string
  url: string
}

export interface GithubBitDataComment {
  author: GithubBitDataUser
  createdAt: string
  body: string
}

export interface GithubBitDataUser {
  email: string
  login: string
  avatarUrl: string
}