export type GithubPeopleQueryResult = {
  organization: {
    members: {
      totalCount: number
      pageInfo: {
        hasNextPage: boolean
      }
      edges: {
        cursor: string
        node: {
          id: string
          login: string
          location: string
          avatarUrl: string
          bio: string
          email: string
        }
      }[]
    }
  }
  rateLimit: {
    limit: number
    cost: number
    remaining: number
    resetAt: string
  }
}

export type GithubPerson = GithubPeopleQueryResult["organization"]["members"]["edges"][0]["node"];

export const GithubPeopleQuery = `
query GitHubIssueQuery($organization: String!, $cursor: String) {
  organization(login: $organization) {
    members(first: 100, after: $cursor) {
      totalCount
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          login
          location
          avatarUrl
          bio
          email
        }
      }
    }
  }
  rateLimit {
    limit
    cost
    remaining
    resetAt
  }
}
`