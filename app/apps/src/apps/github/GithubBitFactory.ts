import { AppBit, Bit } from '@mcro/models'
import { createBit, hash } from '@mcro/sync-kit'
import { GithubComment, GithubCommit, GithubIssue, GithubPerson, GithubPullRequest } from './GithubTypes'
import { GithubBitData } from './GithubBitData'
import { uniqBy } from 'lodash'

/**
 * Creates bits out of github models.
 */
export class GithubBitFactory {

  constructor(private app: AppBit) {
  }

  /**
   * Creates a new bit from a given Github issue.
   */
  createTaskBit(issue: GithubIssue | GithubPullRequest, comments: GithubComment[]): Bit {
    const id = hash(`github-${this.app.id}-${issue.id}`)
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

    return createBit({
      id,
      appId: this.app.id,
      appIdentifier: 'github',
      type: 'task',
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
    return createBit(
      {
        appIdentifier: 'github',
        appId: this.app.id,
        type: 'person',
        originalId: githubPerson.id,
        title: githubPerson.login,
        email: githubPerson.email,
        photo: githubPerson.avatarUrl,
        webLink: `https://github.com/${githubPerson.login}`,
      },
      githubPerson.id,
    )
  }

  /**
   * Creates a single app person from a commit.
   */
  createPersonBitFromCommit(commit: GithubCommit): Bit {
    return createBit(
      {
        appIdentifier: 'github',
        appId: this.app.id,
        type: 'person',
        originalId: commit.email,
        title: commit.name,
        email: commit.email,
        photo: commit.avatarUrl,
      },
      commit.email,
    )
  }


}
