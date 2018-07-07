export type GithubIssueQueryResult = {
  repository: {
    id: string
    name: string
    issues: {
      totalCount: number
      pageInfo: {
        hasNextPage: boolean
      }
      edges: {
        cursor: string
        node: {
          id: string
          title: string
          number: number
          body: string
          bodyText: string
          createdAt: string
          updatedAt: string
          author: {
            avatarUrl: string
            login: string
          }
          labels: {
            edges: { node: { name: string } }[]
          }
          comments: {
            edges: {
              node: {
                author: {
                  avatarUrl: string
                  login: string
                }
                createdAt: string
                body: string
              }
            }[]
          }
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

export type GithubIssue = GithubIssueQueryResult["repository"]["issues"]["edges"][0]["node"];

export const GithubIssueQuery = `
query GithubIssueQuery($organization: String!, $repository: String!, $cursor: String) {
  repository(owner: $organization, name: $repository) {
    id
    name
    issues(first: 100, after: $cursor) {
      totalCount
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          title
          number
          body
          bodyText
          updatedAt
          createdAt
          author {
            avatarUrl
            login
          }
          labels(first: 10) {
            edges {
              node {
                name
              }
            }
          }
          comments(first: 100) {
            edges {
              node {
                author {
                  avatarUrl
                  login
                }
                createdAt
                body
              }
            }
          }
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