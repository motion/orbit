/**
 * Confluence paginated (collections) are returned in this format.
 */
export type ConfluenceCollection<T> = {
  results: T[]
  start: number
  limit: number
  size: number
}

/**
 * Confluence user group.
 *
 * @see https://developer.atlassian.com/cloud/confluence/rest/#api-group-get
 */
export type ConfluenceGroup = {
  name: string
}

/**
 * Member of the confluence user group.
 *
 * @see https://developer.atlassian.com/cloud/confluence/rest/#api-group-groupName-member-get
 */
export type ConfluenceUser = {
  accountId: string
  displayName: string
  profilePicture: {
    path: string
    height: number
    width: number
  }
  username: string
  details: {
    personal: {
      email: string
    }
  }
  userKey: string
  latest: boolean
}

/**
 * Some confluence content, like pages.
 *
 * @see https://developer.atlassian.com/cloud/confluence/rest/#api-content-get
 */
export type ConfluenceContent = {
  type: 'page'
  childTypes: {
    attachment: {
      value: boolean
    }
    comment: {
      value: boolean
    }
    page: {
      value: boolean
    }
  }
  body: {
    styled_view: {
      value: string
    }
  }
  history: {
    contributors: {
      publishers: {
        userAccountIds: string[]
      }
    }
    createdDate: string
    createdBy: ConfluenceUser
    lastUpdated: {
      by: ConfluenceUser
      when: string
    }
  }
  space: {
    id: string
    name: string
    _links: {
      base: string
      webui: string
    }
  }
  extensions: Object
  id: string
  status: string
  title: string
  _links: {
    base: string
    webui: string
  }

  // custom properties
  comments: ConfluenceComment[]
}

/**
 * Confluence content comment.
 *
 * @see https://developer.atlassian.com/cloud/confluence/rest/#api-content-id-child-comment-get
 */
export type ConfluenceComment = {
  title: string
  history: {
    createdBy: ConfluenceUser
  }
}