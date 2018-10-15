import { PersonUtils } from '@mcro/model-utils'
import { GithubPersonData, Person, Setting } from '@mcro/models'
import { GithubCommit, GithubIssue, GithubPerson, GithubPullRequest } from '@mcro/services'
import { hash } from '@mcro/utils'
import { uniqBy } from 'lodash'

/**
 * Creates a Github Person.
 */
export class GithubPersonFactory {
  setting: Setting

  constructor(setting: Setting) {
    this.setting = setting
  }

  /**
   * Finds all participated people in a github issue and creates integration
   * people from them.
   */
  createFromIssue(issue: GithubIssue): Person[] {
    const comments = issue.comments.edges.map(edge => edge.node)

    const githubPeople = uniqBy([
      issue.author,
      ...comments.map(comment => comment.author),
      ...issue.assignees.edges.map(user => user.node),
      ...issue.participants.edges.map(user => user.node),
    ], 'id').filter(user => !!user)

    return githubPeople.map(githubPerson => this.createFromGithubUser(githubPerson))
  }

  /**
   * Finds all participated people in a github pull request and creates integration
   * people from them.
   */
  createFromPullRequest(pr: GithubPullRequest): Person[] {
    const comments = pr.comments.edges.map(edge => edge.node)
    const commits = pr.commits.edges.map(edge => edge.node.commit)
    const reviews = pr.reviews.edges.map(edge => edge.node)

    const githubPeople = uniqBy([
      pr.author,
      ...comments.map(comment => comment.author),
      ...pr.assignees.edges.map(user => user.node),
      ...pr.participants.edges.map(user => user.node),
      ...reviews.map(user => user.author),
      ...commits.filter(commit => !!commit.user).map(commit => commit.user)
    ], 'id').filter(user => !!user)

    const usersFromCommit = commits.filter(commit => {
      return !commit.user && githubPeople.find(person => person.email === commit.email)
    })

    return [
      ...githubPeople.map(githubPerson => this.createFromGithubUser(githubPerson)),
      ...usersFromCommit.map(commit => this.createFromCommit(commit))
    ]
  }

  /**
   * Creates a single integration person from given Github user.
   */
  createFromGithubUser(githubPerson: GithubPerson): Person {

    const id = hash(`github-${this.setting.id}-${githubPerson.id}`)
    const data: GithubPersonData = {}

    return PersonUtils.create({
      id,
      setting: this.setting,
      integrationId: githubPerson.id,
      integration: 'github',
      name: githubPerson.login,
      webLink: `https://github.com/${githubPerson.login}`,
      email: githubPerson.email,
      photo: githubPerson.avatarUrl,
      // raw: githubPerson,
      data
    })
  }

  /**
   * Creates a single integration person from a commit.
   */
  createFromCommit(commit: GithubCommit): Person {

    const id = hash(`github-${this.setting.id}-commit-user-${commit.email}`)
    const data: GithubPersonData = {}

    return PersonUtils.create({
      id,
      setting: this.setting,
      integrationId: undefined,
      integration: 'github',
      name: commit.name,
      webLink: undefined,
      email: commit.email,
      photo: commit.avatarUrl,
      // raw: commit,
      data
    })
  }

}
