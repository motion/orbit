import { AppBit, Bit } from '@mcro/models'
import { createBit, sanitizeHtml, stripHtml } from '@mcro/sync-kit'
import { JiraIssue, JiraUser } from './JiraTypes'
import { JiraAppData } from './JiraAppData'
import { JiraBitData } from './JiraBitData'

/**
 * Creates bits out of jira models.
 */
export class JiraBitFactory {

  constructor(private app: AppBit) {
  }

  /**
   * Builds a bit from the given jira issue.
   */
  createDocumentBit(issue: JiraIssue, allPeople: Bit[]): Bit {
    const bitCreatedAt = new Date(issue.fields.created).getTime()
    const bitUpdatedAt = new Date(issue.fields.updated).getTime()
    const values = (this.app.data as JiraAppData).values['data']['values']
    const domain = values.credentials.domain
    const body = stripHtml(issue.renderedFields.description)
    const cleanHtml = sanitizeHtml(issue.renderedFields.description)

    // get people contributed to this bit (content author, editors, commentators)
    const peopleIds = []
    if (issue.fields.comment)
      peopleIds.push(...issue.comments.map(comment => comment.author.accountId))
    if (issue.fields.assignee) peopleIds.push(issue.fields.assignee.accountId)
    if (issue.fields.creator) peopleIds.push(issue.fields.creator.accountId)
    if (issue.fields.reporter) peopleIds.push(issue.fields.reporter.accountId)

    const people = allPeople.filter(person => {
      return peopleIds.indexOf(person.originalId) !== -1
    })

    // find original content creator
    const author = allPeople.find(person => {
      return person.originalId === issue.fields.creator.accountId
    })

    // create or update a bit
    return createBit(
      {
        appIdentifier: 'jira',
        appId: this.app.id,
        type: 'document',
        title: issue.fields.summary,
        body,
        author,
        data: {
          content: cleanHtml,
        } as JiraBitData,
        location: {
          id: issue.fields.project.id,
          name: issue.fields.project.name,
          webLink: domain + '/browse/' + issue.fields.project.key,
          desktopLink: '',
        },
        webLink: domain + '/browse/' + issue.key,
        people,
        bitCreatedAt,
        bitUpdatedAt,
      },
      issue.id,
    )
  }

  /**
   * Creates person entity from a given Jira user.
   */
  createPersonBit(user: JiraUser): Bit {
    return createBit(
      {
        appIdentifier: 'jira',
        appId: this.app.id,
        type: 'person',
        originalId: user.accountId,
        title: user.displayName,
        email: user.emailAddress,
        photo: user.avatarUrls['48x48'].replace('s=48', 's=512'),
      },
      user.accountId,
    )
  }

}
