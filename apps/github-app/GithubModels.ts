
export interface GithubBitData {
  closed: boolean
  body: string
  labels: GithubBitDataLabel[]
  author: GithubBitDataUser
  comments: GithubBitDataComment[]
}

export interface GithubBitDataLabel {
  name: string
  description: string
  color: string
  url: string
}

export interface GithubBitDataComment {
  author: GithubBitDataUser
  createdAt: string
  body: string
}

export interface GithubBitDataUser {
  email: string
  login: string
  avatarUrl: string
}

export type GithubPaginatedResult<T> = {
  totalCount: number
  pageInfo: {
    endCursor: string
    hasNextPage: boolean
  }
  nodes: T[]
}

export type GithubRateLimitResult = {
  rateLimit: {
    limit: number
    cost: number
    remaining: number
    resetAt: string
  }
}

export interface GithubRepository {
  id: string
  name: string
  nameWithOwner: string
  url: string
  pushedAt: string
  issues: {
    nodes: {
      updatedAt: string
    }[]
    totalCount: number
  }
  pullRequests: {
    nodes: {
      updatedAt: string
    }[]
    totalCount: number
  }
}

export type GithubUserRepositoriesQueryResult = {
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
} & GithubRateLimitResult

export type GithubRepositoryQueryResult = {
  repository: GithubRepository
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
} & GithubRateLimitResult

export type GithubIssueQueryResult = {
  repository: {
    id: string
    name: string
    issues: GithubPaginatedResult<GithubIssue>
  }
} & GithubRateLimitResult

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
    totalCount: number
  }
}

export type GithubComment = {
  author: GithubPerson
  createdAt: string
  body: string
}

export type GithubCommentsResponse = {
  repository: {
    id: string
    name: string
    issueOrPullRequest: {
      id: string
      comments: GithubPaginatedResult<GithubComment>
    }
  }
} & GithubRateLimitResult

export type GithubPullRequestQueryResult = {
  repository: {
    id: string
    name: string
    pullRequests: GithubPaginatedResult<GithubPullRequest>
  }
} & GithubRateLimitResult

export type GithubCommit = {
  email: string
  name: string
  avatarUrl: string
  user: GithubPerson|null
}

export type GithubPullRequest = {
  id: string
  title: string
  number: number
  body: string
  bodyText: string
  createdAt: string
  updatedAt: string
  closed: boolean
  author: GithubPerson
  url: string
  repository: {
    id: string
    name: string
    url: string
    owner: {
      login: string
    }
  }
  assignees: {
    edges: {
      node: GithubPerson
    }[]
  }
  comments: {
    totalCount: number
  }
  commits: {
    edges: {
      node: {
        commit: GithubCommit
      }
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
  reviews: {
    edges: {
      node: {
        author: GithubPerson
      }
    }[]
  }
  participants: {
    edges: {
      node: GithubPerson
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
} & GithubRateLimitResult

export type GithubPerson = {
  id: string
  login: string
  location: string
  avatarUrl: string
  bio: string
  email: string
  name: string
}

/**
 * Information about repository last sync.
 * Used to implement partial syncing.
 */
export interface GithubAppValuesLastSyncRepositoryInfo {
  /**
   * Updated date of the last synced issue.
   * We don't need to query github issues/prs from the api older than this date for sync.
   */
  lastSyncedDate?: number

  /**
   * If last time sync wasn't finished, this value will have last cursor where sync stopped.
   */
  lastCursor?: string

  /**
   * Updated date of the last synced issue BEFORE sync finish completely.
   *
   * Since we need to save last synced date we cannot use local variable inside syncer until sync process finish
   * because sync process can be stopped and next time start from another point where issue updated date will be different.
   *
   * We cannot use lastSyncedDate UNTIL we completely finish sync
   * because if sync stop unfinished and number of total issues will change,
   * it will make syncer to drop last cursor but it needs to have a previous value of lastSyncedDate
   * which will become different already, thus invalid.
   */
  lastCursorSyncedDate?: number

  /**
   * Number of issues was loaded and synced from the last cursor.
   */
  lastCursorLoadedCount?: number
}

export interface GithubAppValues {
  /**
   * By default we sync all github repositories.
   * This called "sync all mode". We use this mode until whitelist is undefined.
   * User can exclude repositories from sync by not including them in the whitelist.
   * Once he excludes any repository from the list, whitelist of all repositories is created
   * excluding excluded repositories. All new repositories won't be synced in this mode.
   * To disable whitelist mode and enable sync all mode it should be set to undefined.
   */
  whitelist?: string[]

  /**
   * List of public repositories (other than ones he owns) that we need to sync.
   */
  externalRepositories: string[]

  /**
   * Information about repository issues last sync.
   * Used to implement partial syncing.
   */
  lastSyncIssues: {
    [repository: string]: GithubAppValuesLastSyncRepositoryInfo
  }

  /**
   * Information about repository pull requests last sync.
   * Used to implement partial syncing.
   */
  lastSyncPullRequests: {
    [repository: string]: GithubAppValuesLastSyncRepositoryInfo
  }

  oauth: {
    refreshToken: string
    secret: string
    clientId: string
  }
}

export interface GithubAppData {
  values: GithubAppValues
  data: {
    /**
     * Github repositories.
     */
    repositories: any[]
  }
}