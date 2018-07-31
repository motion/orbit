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
          name
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