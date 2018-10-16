/**
 * Defines a throttling for service loader.
 * This is required to not overload user network with service queries.
 */
export const ServiceLoadThrottlingOptions = {

  /**
   * Throttling options for slack service.
   */
  slack: {

    /**
     * Delay before users load.
     */
    users: 10,

    /**
     * Delay before channels load.
     */
    channels: 10,

    /**
     * Delay before messages load.
     */
    messages: 10

  },

  /**
   * Throttling options for jira service.
   */
  jira: {

    /**
     * Delay before users load.
     */
    users: 10,

    /**
     * Delay before issues load.
     */
    issues: 10,

    /**
     * Delay before issue comments load.
     */
    comments: 10

  },

  /**
   * Throttling options for confluence service.
   */
  confluence: {

    /**
     * Delay before users load.
     */
    users: 10,

    /**
     * Delay before content load.
     */
    contents: 10,

    /**
     * Delay before issue comments load.
     */
    comments: 10

  },

  /**
   * Throttling options for drive service.
   */
  drive: {

    /**
     * Delay before files load.
     */
    files: 10,

    /**
     * Delay before file content load.
     */
    fileContent: 10,

    /**
     * Delay before file comments load.
     */
    comments: 10,

    /**
     * Delay before file revisions load.
     */
    revisions: 10,

    /**
     * Delay before file thumbnail download.
     */
    thumbnailDownload: 10

  },

  /**
   * Throttling options for github service.
   */
  github: {

    /**
     * Delay before organizations list load.
     */
    organizations: 10,

    /**
     * Delay before file repositories load.
     */
    repositories: 10,

    /**
     * Delay before issues load.
     */
    issues: 10,

    /**
     * Delay before pull requests load.
     */
    pullRequests: 10,

    /**
     * Delay before file users load.
     */
    users: 10

  },

  /**
   * Throttling options for gmail service.
   */
  gmail: {

    /**
     * Delay before history list load.
     */
    history: 10,

    /**
     * Delay before threads load.
     */
    threads: 10,

    /**
     * Delay before messages load.
     */
    messages: 10,

  }

}