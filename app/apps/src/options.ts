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
    users: 100,

    /**
     * Delay before channels load.
     */
    channels: 100,

    /**
     * Delay before messages load.
     */
    messages: 100

  },

  /**
   * Throttling options for jira service.
   */
  jira: {

    /**
     * Delay before users load.
     */
    users: 100,

    /**
     * Delay before issues load.
     */
    issues: 100,

    /**
     * Delay before issue comments load.
     */
    comments: 100

  },

  /**
   * Throttling options for confluence service.
   */
  confluence: {

    /**
     * Delay before users load.
     */
    users: 100,

    /**
     * Delay before content load.
     */
    contents: 100,

    /**
     * Delay before issue comments load.
     */
    comments: 100

  },

  /**
   * Throttling options for drive service.
   */
  drive: {

    /**
     * Delay before files load.
     */
    files: 100,

    /**
     * Delay before file content load.
     */
    fileContent: 100,

    /**
     * Delay before file comments load.
     */
    comments: 100,

    /**
     * Delay before file revisions load.
     */
    revisions: 100,

    /**
     * Delay before file thumbnail download.
     */
    thumbnailDownload: 100

  },

  /**
   * Throttling options for github service.
   */
  github: {

    /**
     * Delay before organizations list load.
     */
    organizations: 100,

    /**
     * Delay before file repositories load.
     */
    repositories: 100,

    /**
     * Delay before issues load.
     */
    issues: 100,

    /**
     * Delay before issue or pull request comments load.
     */
    comments: 100,

    /**
     * Delay before pull requests load.
     */
    pullRequests: 100,

    /**
     * Delay before file users load.
     */
    users: 100

  },

  /**
   * Throttling options for gmail service.
   */
  gmail: {

    /**
     * Delay before history list load.
     */
    history: 100,

    /**
     * Delay before threads load.
     */
    threads: 100,

    /**
     * Delay before messages load.
     */
    messages: 100,

  }

}