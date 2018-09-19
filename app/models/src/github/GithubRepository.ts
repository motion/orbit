export interface GithubRepository {
  id: string
  name: string
  nameWithOwner: string
  url: string
  pushedAt: string
  issues: {
    totalCount: number
  }
}
