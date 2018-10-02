import { GmailFetchOptions, GmailHistory, GmailThread, GmailThreadResult, GmailUserProfile } from './GMailTypes'

/**
 * GMail queries.
 *
 * @see https://developers.google.com/gmail/api/v1/reference/
 */
export class GMailQueries {

  /**
   * Gets the user profile information.
   *
   * @see https://developers.google.com/gmail/api/v1/reference/users/getProfile
   */
  static userProfile(userId = 'me'): GmailFetchOptions<GmailUserProfile> {
    return {
      url: `/users/${userId}/profile`
    }
  }

  /**
   * Gets the list of user threads.
   *
   * @see https://developers.google.com/gmail/api/v1/reference/users/threads/list
   */
  static threads(max: number, filter?: string, pageToken?: string, userId = 'me'): GmailFetchOptions<GmailThreadResult> {
    return {
      url: `/users/${userId}/threads`,
      query: {
        maxResults: max,
        nextPageToken: pageToken,
        q: filter,
      }
    }
  }

  /**
   * Gets a single thread. Used to get thread messages.
   *
   * @see https://developers.google.com/gmail/api/v1/reference/users/threads/get
   */
  static thread(threadId: string, userId = 'me'): GmailFetchOptions<GmailThread> {
    return {
      url: `/users/${userId}/threads/${threadId}`
    }
  }

  /**
   * Gets all history records since a given startHistoryId.
   * Used to get history of new events in the mail since last history event id.
   *
   * @see https://developers.google.com/gmail/api/v1/reference/users/history/list
   */
  static history(startHistoryId: string, pageToken: string|undefined = undefined, userId = 'me'): GmailFetchOptions<GmailHistory> {
    return {
      url: `/users/${userId}/history`,
      query: {
        startHistoryId,
        nextPageToken: pageToken
      }
    }
  }

}


