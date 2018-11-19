import { BitUtils } from '@mcro/model-utils'
import { Bit, GithubBitData, GithubSource } from '@mcro/models'
import { GithubIssue, GithubComment, GithubPullRequest } from '@mcro/services'
import { hash } from '@mcro/utils'

/**
 * Creates a Github Bit.
 */
export class GithubBitFactory {
  private source: GithubSource

  constructor(source: GithubSource) {
    this.source = source
  }

  /**
   * Creates a new bit from a given Github issue.
   */
  createFromIssue(issue: GithubIssue | GithubPullRequest, comments: GithubComment[]): Bit {
    const id = hash(`github-${this.source.id}-${issue.id}`)
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

    return BitUtils.create({
      id,
      sourceId: this.source.id,
      spaceId: this.source.spaceId,
      integration: 'github',
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
}
