import { AppBit, Bit } from '@o/kit'
import { sanitizeHtml, stripHtml, WorkerUtilsInstance } from '@o/worker-kit'

import { JiraAppData, JiraBitData, JiraIssue, JiraUser } from './JiraModels'

/**
 * Creates bits out of jira models.
 */
export class JiraBitFactory {
  constructor(private app: AppBit, private utils: WorkerUtilsInstance) {}

  /**
   * Builds a bit from the given jira issue.
   */
  createDocumentBit(issue: JiraIssue, allPeople: Bit[]): Bit {
    const bitCreatedAt = new Date(issue.fields.created).getTime()
    const bitUpdatedAt = new Date(issue.fields.updated).getTime()
    const appData: JiraAppData = this.app.data
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

    const data: JiraBitData = {
      content: cleanHtml,
    }

    // create or update a bit
    return this.utils.createBit({
      type: 'document',
      originalId: issue.id,
      title: issue.fields.summary,
      body,
      author,
      data,
      location: {
        id: issue.fields.project.id,
        name: issue.fields.project.name,
        webLink: appData.setup.domain + '/browse/' + issue.fields.project.key,
        desktopLink: '',
      },
      webLink: appData.setup.domain + '/browse/' + issue.key,
      people,
      bitCreatedAt,
      bitUpdatedAt,
    })
  }

  /**
   * Creates person entity from a given Jira user.
   */
  createPersonBit(user: JiraUser): Bit {
    return this.utils.createBit({
      type: 'person',
      originalId: user.accountId,
      title: user.displayName,
      email: user.emailAddress,
      photo: user.avatarUrls['48x48'].replace('s=48', 's=512'),
    })
  }
}
