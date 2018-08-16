
/**
 * Confluence user group response result.
 *
 * @see https://developer.atlassian.com/cloud/confluence/rest/#api-group-get
 */
export type ConfluenceGroupResponse = {
  results: ConfluenceGroup[]
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
 * Confluence user group members response result.
 *
 * @see https://developer.atlassian.com/cloud/confluence/rest/#api-group-groupName-member-get
 */
export type ConfluenceMemberResponse = {
  results: ConfluenceUser[]
  start: number
  limit: number
  size: number
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
 * Confluence content response result.
 *
 * @see https://developer.atlassian.com/cloud/confluence/rest/#api-content-get
 */
export type ConfluenceContentResponse = {
  results: ConfluenceContent[]
  start: number
  limit: number
  size: number
}

/**
 * Some confluence content, like pages.
 *
 * @see https://developer.atlassian.com/cloud/confluence/rest/#api-content-get
 */
export type ConfluenceContent = {
  type: 'page'
  body: {
    storage: {
      value: string
    }
  }
  history: {
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
}

export type ConfluenceObj = {
  response: ConfluenceContent
  markdownBody: string
  body: string
}
