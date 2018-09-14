import { Logger } from '@mcro/logger'
import { GithubBitData, Person, SlackBitData, SlackSettingValues } from '@mcro/models'
import { BitEntity } from '../../entities/BitEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { BitUtils } from '../../utils/BitUtils'
import { CommonUtils } from '../../utils/CommonUtils'
import { GithubIssue } from './GithubTypes'

/**
 * Creates a Github Bit.
 */
export class GithubBitFactory {
  setting: SettingEntity

  constructor(setting: SettingEntity) {
    this.setting = setting
  }

  /**
   * Creates a new bit from a given Github issue.
   */
  create(issue: GithubIssue): BitEntity {

    const id = CommonUtils.hash(`github-${this.setting.id}-${issue.id}`)
    const createdAt = new Date(issue.createdAt).getTime()
    const updatedAt = new Date(issue.updatedAt).getTime()

    const data: GithubBitData = {
      closed: issue.closed,
      body: issue.body,
      comments: issue.comments.edges.map(edge => {
        // note: if user is removed on a github comment will have author set to "null"
        return {
          author: edge.node.author ? {
            avatarUrl: edge.node.author.avatarUrl,
            login: edge.node.author.login,
            email: edge.node.author.email,
          } : undefined,
          createdAt: edge.node.createdAt,
          body: edge.node.body,
        }
      }),
      author: {
        avatarUrl: issue.author.avatarUrl,
        login: issue.author.login,
        email: issue.author.email,
      },
      labels: issue.labels.edges.map(label => ({
        name: label.node.name,
        description: label.node.description,
        color: label.node.color,
        url: label.node.url,
      })),
      assignees: issue.assignees.edges.map(user => ({
        avatarUrl: user.node.avatarUrl,
        login: user.node.login,
        email: user.node.email,
      }))
    }

    return BitUtils.create({
      id,
      settingId: this.setting.id,
      integration: 'github',
      type: 'task',
      title: issue.title,
      body: issue.bodyText,
      webLink: issue.url,
      location: {
        id: issue.repository.id,
        name: issue.repository.name,
        webLink: issue.repository.url,
        desktopLink: ''
      },
      data,
      raw: issue,
      bitCreatedAt: createdAt,
      bitUpdatedAt: updatedAt,
    })
  }

}
