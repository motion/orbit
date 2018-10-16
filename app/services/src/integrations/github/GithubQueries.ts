export const GithubRepositoriesQuery = `
query GithubRepositoriesQuery($cursor: String) {
  viewer {
    repositories(first: 100, after: $cursor) {
      totalCount
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          name
          nameWithOwner
          url
          pushedAt
          issues {
            totalCount
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

export const GithubOrganizationsQuery = `
query GithubOrganizationsQuery($cursor: String) {
  viewer {
    organizations(first: 100, after: $cursor) {
      totalCount
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          id
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

export const GithubIssueQuery = `
query GithubIssueQuery($organization: String!, $repository: String!, $cursor: String) {
  repository(owner: $organization, name: $repository) {
    id
    name
    issues(first: 5, after: $cursor) {
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
          closed
          repository {
            id
            name
            url
            owner {
              login
            }
          }
          author {
            ... on User {
              id
              login
              location
              avatarUrl
              bio
              email
              name
            }
          }
          assignees(first: 100) {
            edges {
              node {
                ... on User {
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
          comments(first: 100) {
            edges {
              node {
                author {
                  ... on User {
                    id
                    login
                    location
                    avatarUrl
                    bio
                    email
                    name
                  }
                }
                createdAt
                body
              }
            }
          }
          participants(first: 100) {
            edges {
              node {
                ... on User {
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
          labels(first: 10) {
            edges {
              node {
                name
                description
                color
                url
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

export const GithubPullRequestsQuery = `
query GithubPullRequestsQuery($organization: String!, $repository: String!, $cursor: String) {
  repository(owner: $organization, name: $repository) {
    id
    name
    pullRequests(first: 5, after: $cursor) {
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
          closed
          repository {
            id
            name
            url
            owner {
              login
            }
          }
          author {
            ... on User {
              id
              login
              location
              avatarUrl
              bio
              email
              name
            }
          }
          assignees(first: 100) {
            edges {
              node {
                ... on User {
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
          comments(first: 100) {
            edges {
              node {
                author {
                  ... on User {
                    id
                    login
                    location
                    avatarUrl
                    bio
                    email
                    name
                  }
                }
                createdAt
                body
              }
            }
          }
          commits(first: 100) {
            edges {
              node {
                commit {
                  author {
                    email
                    name
                    avatarUrl
                    user {
                      ... on User {
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
              }
            }
          }
          labels(first: 10) {
            edges {
              node {
                name
                description
                color
                url
              }
            }
          }
          participants(first: 100) {
            edges {
              node {
                ... on User {
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
          reviews(first: 100) {
            edges {
              node {
                author {
                  ... on User {
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
query GithubPeopleQuery($organization: String!, $cursor: String) {
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
