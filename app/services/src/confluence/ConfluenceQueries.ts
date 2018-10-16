import { ServiceLoaderLoadOptions } from '../loader/ServiceLoaderTypes'
import {
  ConfluenceCollection,
  ConfluenceComment,
  ConfluenceContent,
  ConfluenceGroup,
  ConfluenceUser,
} from './ConfluenceTypes'

/**
 * Confluence queries.
 */
export class ConfluenceQueries {

  /**
   * API test query.
   */
  static test(): ServiceLoaderLoadOptions<ConfluenceCollection<ConfluenceContent>> {
    return {
      path: '/wiki/rest/api/content',
      query: {
        limit: 1,
        start: 0,
      }
    }
  }

  /**
   * Content (pages and blogposts) query.
   */
  static contents(type: 'page' | 'blogpost', start: number, limit: number): ServiceLoaderLoadOptions<ConfluenceCollection<ConfluenceContent>> {
    return {
      path: '/wiki/rest/api/content',
      query: {
        type,
        start,
        limit,
        expand:
          'childTypes.all,space,body.styled_view,history,history.lastUpdated,history.contributors,history.contributors.publishers',
      }
    }
  }

  /**
   * Comments search query.
   */
  static comments(contentId: string, start: number, limit: number): ServiceLoaderLoadOptions<ConfluenceCollection<ConfluenceComment>> {
    return {
      path: `/wiki/rest/api/content/${contentId}/child/comment`,
      query: {
        start,
        limit,
        expand: 'history.createdBy',
      }
    }
  }

  /**
   * Groups search query.
   */
  static groups(): ServiceLoaderLoadOptions<ConfluenceCollection<ConfluenceGroup>> {
    return {
      path: '/wiki/rest/api/group'
    }
  }

  /**
   * Group memebers search query.
   */
  static groupMembers(groupName: string): ServiceLoaderLoadOptions<ConfluenceCollection<ConfluenceUser>> {
    return {
      path: `/wiki/rest/api/group/${groupName}/member`,
      query: {
        expand: 'operations,details.personal'
      }
    }
  }

}