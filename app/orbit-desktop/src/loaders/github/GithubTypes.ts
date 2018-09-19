import { GithubRepository } from '@mcro/models'

export type GithubRepositoryQueryResult = {
  viewer: {
    repositories: {
      edges: {
        cursor: string
        node: GithubRepository
      }[]
      pageInfo: {
        hasNextPage: boolean
      }
      totalCount: number
    }
  }
  rateLimit: {
    limit: number
    cost: number
    remaining: number
    resetAt: string
  }
}

export type GithubOrganizationsQueryResult = {
  viewer: {
    organizations: {
      edges: {
        cursor: string
        node: GithubOrganization
      }[]
      pageInfo: {
        hasNextPage: boolean
      }
      totalCount: number
    }
  }
  rateLimit: {
    limit: number
    cost: number
    remaining: number
    resetAt: string
  }
}

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
        node: GithubIssue
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

export type GithubOrganization = {
  id: string
  name: string
}

export type GithubIssue = {
  id: string
  title: string
  number: number
  body: string
  bodyText: string
  createdAt: string
  updatedAt: string
  closed: boolean
  author: GithubPerson
  assignees: {
    edges: {
      node: GithubPerson
    }[]
  }
  participants: {
    edges: {
      node: GithubPerson
    }[]
  }
  labels: {
    edges: {
      node: {
        name: string
        description: string
        color: string
        url: string
      }
    }[]
  }
  url: string
  repository: {
    id: string
    name: string
    url: string
    owner: {
      login: string
    }
  }
  comments: {
    edges: {
      node: {
        author: GithubPerson
        createdAt: string
        body: string
      }
    }[]
  }
}

export type GithubPeopleQueryResult = {
  organization: {
    members: {
      totalCount: number
      pageInfo: {
        hasNextPage: boolean
      }
      edges: {
        cursor: string
        node: GithubPerson
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

export type GithubPerson = {
  id: string
  login: string
  location: string
  avatarUrl: string
  bio: string
  email: string
  name: string
}
