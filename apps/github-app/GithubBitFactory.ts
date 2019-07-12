import { Bit } from '@o/kit'
import { WorkerUtilsInstance } from '@o/worker-kit'
import { uniqBy } from 'lodash'

import { GithubBitData, GithubComment, GithubCommit, GithubIssue, GithubPerson, GithubPullRequest } from './GithubModels'

/**
 * Creates bits out of github models.
 */
export class GithubBitFactory {
  constructor(private utils: WorkerUtilsInstance) {}

  /**
   * Creates a new bit from a given Github issue.
   */
  createTaskBit(issue: GithubIssue | GithubPullRequest, comments: GithubComment[]): Bit {
    const createdAt = new Date(issue.createdAt).getTime()
    const updatedAt = new Date(issue.updatedAt).getTime()

    const data: GithubBitData = {
      closed: issue.closed,
      body: issue.body,
      comments: comments.map(comment => {
        // note: if user is removed on a github comment will have author set to "null"
        return {
          author: comment.author
            ? {
                avatarUrl: comment.author.avatarUrl,
                login: comment.author.login,
                email: comment.author.email,
              }
            : undefined,
          createdAt: comment.createdAt,
          body: comment.body,
        }
      }),
      author: issue.author
        ? {
            avatarUrl: issue.author.avatarUrl,
            login: issue.author.login,
            email: issue.author.email,
          }
        : undefined,
      labels: issue.labels.edges.map(label => ({
        name: label.node.name,
        description: label.node.description,
        color: label.node.color,
        url: label.node.url,
      })),
    }

    return this.utils.createBit({
      type: 'task',
      originalId: issue.id,
      title: issue.title,
      body: issue.bodyText,
      webLink: issue.url,
      location: {
        id: issue.repository.id,
        name: issue.repository.name,
        webLink: issue.repository.url,
        desktopLink: '',
      },
      data,
      bitCreatedAt: createdAt,
      bitUpdatedAt: updatedAt,
    })
  }

  /**
   * Finds all participated people in a github issue and creates app
   * people from them.
   */
  createPersonBitFromIssue(issue: GithubIssue): Bit[] {
    return issue.participants.edges
      .map(user => user.node)
      .filter(user => !!user)
      .map(githubPerson => this.createPersonBitFromGithubUser(githubPerson))
  }

  /**
   * Finds all participated people in a github pull request and creates app
   * people from them.
   */
  createPersonBitFromPullRequest(pr: GithubPullRequest): Bit[] {
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
      ...githubPeople.map(githubPerson => this.createPersonBitFromGithubUser(githubPerson)),
      ...usersFromCommit.map(commit => this.createPersonBitFromCommit(commit)),
    ]
  }

  /**
   * Creates a single app person from given Github user.
   */
  createPersonBitFromGithubUser(githubPerson: GithubPerson): Bit {
    return this.utils.createBit({
      type: 'person',
      originalId: githubPerson.id,
      title: githubPerson.login,
      email: githubPerson.email,
      photo: githubPerson.avatarUrl,
      webLink: `https://github.com/${githubPerson.login}`,
    })
  }

  /**
   * Creates a single app person from a commit.
   */
  createPersonBitFromCommit(commit: GithubCommit): Bit {
    return this.utils.createBit({
      type: 'person',
      originalId: commit.email,
      title: commit.name,
      email: commit.email,
      photo: commit.avatarUrl,
    })
  }
}
