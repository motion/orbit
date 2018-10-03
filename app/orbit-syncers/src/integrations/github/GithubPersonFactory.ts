import { PersonUtils } from '@mcro/model-utils'
import { GithubPersonData, Person, Setting } from '@mcro/models'
import { GithubIssue, GithubPerson } from '@mcro/services'
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

    return githubPeople.map(githubPerson => this.create(githubPerson))
  }

  /**
   * Creates a single integration person from given Github user.
   */
  create(githubPerson: GithubPerson): Person {

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
      raw: githubPerson,
      data
    })
  }

}
