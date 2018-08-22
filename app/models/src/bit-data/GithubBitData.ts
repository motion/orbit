export interface GithubBitData {
  comments: GithubBitDataComment[]
  body: string
}

export interface GithubBitDataComment {
  author: GithubBitDataCommentPerson
  createdAt: Date
  body: string
}

export interface GithubBitDataCommentPerson {
  login: string
  avatarUrl: string
}