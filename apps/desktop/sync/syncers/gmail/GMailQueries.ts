import { GmailHistory, GmailThread, GmailThreadResult } from './GMailTypes'
import { GmailFetchOptions, GmailUserProfile } from './GMailTypes'

/**
 * Gets the user profile information.
 *
 * @see https://developers.google.com/gmail/api/v1/reference/users/getProfile
 */
export function userProfileQuery(userId = "me"): GmailFetchOptions<GmailUserProfile> {
  return {
    url: `/users/${userId}/profile`
  }
}

/**
 * Gets the list of user threads.
 *
 * @see https://developers.google.com/gmail/api/v1/reference/users/threads/list
 */
export function threadsQuery(max: number, pageToken: string, userId = "me"): GmailFetchOptions<GmailThreadResult> {
  return {
    url: `/users/${userId}/threads`,
    query: {
      maxResults: max,
      nextPageToken: pageToken
    }
  }
}

/**
 * Gets a single thread. Used to get thread messages.
 *
 * @see https://developers.google.com/gmail/api/v1/reference/users/threads/get
 */
export function threadQuery(threadId: string, filter: string, userId = "me"): GmailFetchOptions<GmailThread> {
  return {
    url: `/users/${userId}/threads/${threadId}`,
    query: {
      q: filter
    }
  }
}

/**
 * Gets all history records since a given startHistoryId.
 * Used to get history of new events in the mail since last history event id.
 *
 * @see https://developers.google.com/gmail/api/v1/reference/users/history/list
 */
export function historyQuery(startHistoryId: string, pageToken: string|undefined = undefined, userId = "me"): GmailFetchOptions<GmailHistory> {
  return {
    url: `/users/${userId}/history`,
    query: {
      startHistoryId,
      nextPageToken: pageToken
    }
  }
}

