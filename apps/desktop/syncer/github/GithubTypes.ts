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
          url: string
          repository: {
            id: string
            name: string
            url: string
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

export type GithubPeopleQueryResult = {
  organization: {
    members: {
      totalCount: number
      pageInfo: {
        hasNextPage: boolean
      }
<<<<<<< HEAD:apps/desktop/syncer/github/GithubTypes.ts
      edges: {
        cursor: string
        node: {
          id: string
          login: string
          location: string
          avatarUrl: string
          bio: string
          email: string
          name: string
=======
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
          url
          repository {
            id
            name
            url
          }
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
>>>>>>> master:apps/desktop/sync/syncers/github/issue/GithubIssueQuery.ts
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
