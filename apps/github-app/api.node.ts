import { AppBit } from '@o/kit'
const Octokit = require('@octokit/rest')

/**
 * @see https://octokit.github.io/rest.js/
 */
export const GithubApi = (app: AppBit) => {
  const octokit = new Octokit({
    auth: 'token ' + app.token,
  })

  return {
    getRepository(params?: any) {
      return octokit.repos.get(params)
    },
    listRepositories(params?: any) {
      return octokit.repos.list(params)
    },
    listRepositoriesForOrg(params?: any) {
      return octokit.repos.listForOrg(params)
    },
    createIssue(params?: any) {
      return octokit.issues.create(params)
    },
    getIssue(params?: any) {
      return octokit.issues.get(params)
    },
    listIssues(params?: any) {
      return octokit.issues.list(params)
    },
    getOrganization(params?: any) {
      return octokit.orgs.get(params)
    },
    listOrganizations(params?: any) {
      return octokit.orgs.list(params)
    },
    createPull(params?: any) {
      return octokit.pulls.create(params)
    },
    getPull(params?: any) {
      return octokit.pulls.get(params)
    },
    listPulls(params?: any) {
      return octokit.pulls.list(params)
    },
  }
}
