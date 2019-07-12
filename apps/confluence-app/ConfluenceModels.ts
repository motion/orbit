/**
 * Confluence additional bit information.
 */
export interface ConfluenceBitData {
  /**
   * Html body of the confluence content.
   * Used to show confluence content body.
   */
  content: string
}

/**
 * Confluence application data.
 */
export interface ConfluenceAppData {
  setup: {
    /**
     * Login credentials.
     */
    domain: string
    username: string
    password: string
  }

  values: {
    /**
     * Last pages sync metadata.
     */
    pageLastSync: ConfluenceLastSyncInfo

    /**
     * Last blogs sync metadata.
     */
    blogLastSync: ConfluenceLastSyncInfo
  }
}

/**
 * Information about last sync.
 * Used to implement partial syncing.
 */
export interface ConfluenceLastSyncInfo {
  /**
   * Updated date of the last synced content.
   * We don't need to query confluence content from the api older than this date for sync.
   */
  lastSyncedDate?: number

  /**
   * If last time sync wasn't finished, this value will have last cursor where sync stopped.
   */
  lastCursor?: number

  /**
   * Updated date of the last synced content BEFORE sync finish completely.
   *
   * Since we need to save last synced date we cannot use local variable inside syncer until sync process finish
   * because sync process can be stopped and next time start from another point where content updated date will be different.
   *
   * We cannot use lastSyncedDate UNTIL we completely finish sync
   * because if sync stop unfinished and number of total content will change,
   * it will make syncer to drop last cursor but it needs to have a previous value of lastSyncedDate
   * which will become different already, thus invalid.
   */
  lastCursorSyncedDate?: number

  /**
   * Number of content was loaded and synced from the last cursor.
   */
  lastCursorLoadedCount?: number
}

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
