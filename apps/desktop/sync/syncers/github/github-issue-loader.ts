import { GithubIssueQuery, GithubIssueQueryResult } from './github-issue-query'
import { fetchFromGitHub } from './github-utils'

/**
 * Loads GitHub issues for a single repository.
 */
export class GithubIssueLoader {

  organization: string
  repository: string
  token: string
  totalCost: number = 0;
  remainingCost: number = 0;

  constructor(organization: string,
              repository: string,
              token: string) {
    this.organization = organization
    this.repository = repository
    this.token = token
  }

  async load() {
    console.log(`Syncing ${this.organization}/${this.repository}`);
    const issues = await this.loadByCursor();
    console.log(`Syncing is done. Loaded ${issues.length} issues. Total query cost: ${this.totalCost}/${this.remainingCost}`);
    return issues;
  }

  private async loadByCursor(cursor?: string) {

    // send a request to the github and load first/next 100 issues
    console.log(`Loading ${ cursor ? "next" : "first" } 100 github issues`);
    const results = await fetchFromGitHub<GithubIssueQueryResult>(this.token, GithubIssueQuery, {
      organization: this.organization,
      repository: this.repository,
      cursor
    })

    // query was made. calculate total costs
    this.totalCost += results.rateLimit.cost;
    this.remainingCost = results.rateLimit.remaining;

    const issues = results.repository.issues.edges.map(edge => edge.node)
    if (!cursor) {
      console.log(`${issues.length} issues were loaded`);
      console.log(`There are ${results.repository.issues.totalCount} issues in the repository`);
    } else {
      console.log(`Next ${issues.length} issues were loaded`);
    }

    // if there is a next page we execute next query to api to get all repository issues
    // to get next issues we need a cursor from the last loaded edge
    // and tell github to load issues "after" that cursor
    // cursor basically is a token github returns
    if (results.repository.issues.pageInfo.hasNextPage) {
      const lastEdgeCursor = results.repository.issues.edges[results.repository.issues.edges.length - 1].cursor;
      const nextPageIssues = await this.loadByCursor(lastEdgeCursor);
      return [...issues, ...nextPageIssues];
    }

    return issues;
  }

}