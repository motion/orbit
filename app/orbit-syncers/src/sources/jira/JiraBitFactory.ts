import { Bit, BitUtils, JiraBitData, JiraSource, JiraSourceValues, Person } from '@mcro/models'
import { JiraIssue } from '@mcro/services'
import { SyncerUtils } from '../../core/SyncerUtils'

/**
 * Creates a Jira Bit.
 */
export class JiraBitFactory {
  private source: JiraSource

  constructor(source: JiraSource) {
    this.source = source
  }

  /**
   * Builds a bit from the given jira issue.
   */
  create(issue: JiraIssue, allPeople: Person[]): Bit {
    const bitCreatedAt = new Date(issue.fields.created).getTime()
    const bitUpdatedAt = new Date(issue.fields.updated).getTime()
    const values = this.source.values as JiraSourceValues
    const domain = values.credentials.domain
    const body = SyncerUtils.stripHtml(issue.renderedFields.description)
    const cleanHtml = SyncerUtils.sanitizeHtml(issue.renderedFields.description)

    // get people contributed to this bit (content author, editors, commentators)
    const peopleIds = []
    if (issue.fields.comment)
      peopleIds.push(...issue.comments.map(comment => comment.author.accountId))
    if (issue.fields.assignee) peopleIds.push(issue.fields.assignee.accountId)
    if (issue.fields.creator) peopleIds.push(issue.fields.creator.accountId)
    if (issue.fields.reporter) peopleIds.push(issue.fields.reporter.accountId)

    const people = allPeople.filter(person => {
      return peopleIds.indexOf(person.userId) !== -1
    })

    // find original content creator
    const author = allPeople.find(person => {
      return person.userId === issue.fields.creator.accountId
    })

    // create or update a bit
    return BitUtils.create(
      {
        sourceType: 'jira',
        sourceId: this.source.id,
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
}
