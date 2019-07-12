import { ServiceLoaderLoadOptions } from '@o/kit'
import {
  ConfluenceCollection,
  ConfluenceComment,
  ConfluenceContent,
  ConfluenceGroup,
  ConfluenceUser,
} from './ConfluenceModels'

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

    // scopes we use here:
    // 1. childTypes.all - used to get information if content has comments
    // 2. history.contributors.publishers - used to get people ids who edited content
    // 3. space - used to get "location/directory" of the page
    // 4. body.styled_view - used to get bit body / page content (with html styles included)

    return {
      path: '/wiki/rest/api/content',
      query: {
        type,
        start,
        limit,
        orderby: 'history.createdDate desc',
        // todo: it should be history.lastUpdated.when, but for some reason it didn't work
        // @see https://community.atlassian.com/t5/Answers-Developer-Questions/API-of-Recently-updated-pages-on-Confluence/qaq-p/494205#U938751
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