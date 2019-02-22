import { GithubPersonData, GithubSource, Person, PersonUtils } from '@mcro/models'
import { GithubCommit, GithubIssue, GithubPerson, GithubPullRequest } from '@mcro/services'
import { hash } from '@mcro/utils'
import { uniqBy } from 'lodash'

/**
 * Creates a Github Person.
 */
export class GithubPersonFactory {
  private source: GithubSource

  constructor(source: GithubSource) {
    this.source = source
  }

  /**
   * Finds all participated people in a github issue and creates source
   * people from them.
   */
  createFromIssue(issue: GithubIssue): Person[] {
    return issue.participants.edges
      .map(user => user.node)
      .filter(user => !!user)
      .map(githubPerson => this.createFromGithubUser(githubPerson))
  }

  /**
   * Finds all participated people in a github pull request and creates source
   * people from them.
   */
  createFromPullRequest(pr: GithubPullRequest): Person[] {
    const commits = pr.commits.edges.map(edge => edge.node.commit)
    const reviews = pr.reviews.edges.map(edge => edge.node)

    const githubPeople = uniqBy(
      [
        pr.author,
        ...pr.participants.edges.map(user => user.node),
        ...reviews.map(user => user.author),
        ...commits.filter(commit => !!commit.user).map(commit => commit.user),
      ],
      'id',
    ).filter(user => !!user)

    const usersFromCommit = commits.filter(commit => {
      return !commit.user && githubPeople.find(person => person.email === commit.email)
    })

    return [
      ...githubPeople.map(githubPerson => this.createFromGithubUser(githubPerson)),
      ...usersFromCommit.map(commit => this.createFromCommit(commit)),
    ]
  }

  /**
   * Creates a single source person from given Github user.
   */
  createFromGithubUser(githubPerson: GithubPerson): Person {
    const id = hash(`github-${this.source.id}-${githubPerson.id}`)
    const data: GithubPersonData = {}

    return PersonUtils.create({
      id,
      source: this.source,
      sourceId: githubPerson.id,
      source: 'github',
      name: githubPerson.login,
      webLink: `https://github.com/${githubPerson.login}`,
      email: githubPerson.email,
      photo: githubPerson.avatarUrl,
      data,
    })
  }

  /**
   * Creates a single source person from a commit.
   */
  createFromCommit(commit: GithubCommit): Person {
    const id = hash(`github-${this.source.id}-commit-user-${commit.email}`)
    const data: GithubPersonData = {}

    return PersonUtils.create({
      id,
      source: this.source,
      sourceId: undefined,
      source: 'github',
      name: commit.name,
      webLink: undefined,
      email: commit.email,
      photo: commit.avatarUrl,
      data,
    })
  }
}
