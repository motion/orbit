/**
 * Github Queries.
 */
export class GithubQueries {

  /**
   * User repositories query.
   */
  static userRepositories() {
    return `
query GithubUserRepositoriesQuery($cursor: String) {
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
          updatedAt
          issues(first: 1, orderBy: { direction: DESC, field: UPDATED_AT }) {
            totalCount
            nodes {
              updatedAt
            }
          }
          pullRequests(first: 1, orderBy: { direction: DESC, field: UPDATED_AT }) {
            totalCount
            nodes {
              updatedAt
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
  }

  /**
   * Repository query.
   */
  static repository() {
    return `
query GithubRepositoryQuery($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    id
    name
    nameWithOwner
    url
    pushedAt
    updatedAt
    issues(first: 1, orderBy: { direction: DESC, field: UPDATED_AT }) {
      totalCount
      nodes {
        updatedAt
      }
    }
    pullRequests(first: 1, orderBy: { direction: DESC, field: UPDATED_AT }) {
      totalCount
      nodes {
        updatedAt
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
  }

  static organizations() {
    return `
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
  }

  /**
   * Issues query.
   */
  static issues() {
    return `
query GithubIssueQuery($organization: String!, $repository: String!, $first: Int!, $cursor: String) {
  repository(owner: $organization, name: $repository) {
    id
    name
    issues(first: $first, after: $cursor, orderBy: { direction: DESC, field: UPDATED_AT }) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
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
        comments {
          totalCount
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
  rateLimit {
    limit
    cost
    remaining
    resetAt
  }
}
`
  }

  /**
   * Issue comments query.
   */
  static comments() {
    return `
query GithubCommentsQuery($organization: String!, $repository: String!, $issueOrPrNumber: Int!, $first: Int!, $cursor: String) {
  repository(owner: $organization, name: $repository) {
    id
    name
    issueOrPullRequest(number: $issueOrPrNumber) {
      ... on Issue {
        comments(first: $first, after: $cursor) {
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
          nodes {
            createdAt
            body
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
      ... on PullRequest {
        comments(first: $first, after: $cursor) {
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
          nodes {
            createdAt
            body
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
  rateLimit {
    limit
    cost
    remaining
    resetAt
  }
}
`
  }

  /**
   * Pull requests query.
   */
  static pullRequests() {
    return `
query GithubPullRequestsQuery($organization: String!, $repository: String!, $first: Int!, $cursor: String) {
  repository(owner: $organization, name: $repository) {
    id
    name
    pullRequests(first: $first, after: $cursor, orderBy: { direction: DESC, field: UPDATED_AT }) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
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
  rateLimit {
    limit
    cost
    remaining
    resetAt
  }
}
`
  }

  /**
   * People query.
   */
  static people() {
    return `
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
  }

}
