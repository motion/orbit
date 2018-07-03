export type GitHubIssueFetchResult = {
  data: {
    organization: {
      repository: {
        id: string
        name: string
        issues: {
          edges: {
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
    }
  }
}

export type GithubIssue = GitHubIssueFetchResult['data']['organization']['repository']['issues']['edges'][0]['node'];

export const GithubQuery = `
query GitHubIssueQuery($organization: String!, $repository: String!) {
  organization(login: $organization) {
    repository(name: $repository) {
      id
      name
      issues(first: 100) {
        edges {
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
  }
}
`
