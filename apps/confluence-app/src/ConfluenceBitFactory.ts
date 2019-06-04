import { AppBit, Bit } from '@o/kit'
import { sanitizeHtml, stripHtml, WorkerUtilsInstance } from '@o/worker-kit'

import { ConfluenceAppData, ConfluenceBitData, ConfluenceContent, ConfluenceUser } from './ConfluenceModels'

/**
 * Creates bits out of confluence models.
 */
export class ConfluenceBitFactory {
  constructor(private app: AppBit, private utils: WorkerUtilsInstance) {}

  /**
   * Builds a document bit from the given confluence content.
   */
  createDocumentBit(content: ConfluenceContent, allPeople: Bit[]): Bit {
    const appData: ConfluenceAppData = this.app.data
    const bitCreatedAt = new Date(content.history.createdDate).getTime()
    const bitUpdatedAt = new Date(content.history.lastUpdated.when).getTime()
    const body = stripHtml(content.body.styled_view.value)
    let cleanHtml = sanitizeHtml(content.body.styled_view.value)
    const matches = content.body.styled_view.value.match(
      /<style default-inline-css>((.|\n)*)<\/style>/gi,
    )
    if (matches) cleanHtml = matches[0] + cleanHtml

    // get people contributed to this bit (content author, editors, commentators)
    const peopleIds = [
      content.history.createdBy.accountId,
      ...content.comments.map(comment => comment.history.createdBy.accountId),
      ...content.history.contributors.publishers.userAccountIds,
    ]
    const people = allPeople.filter(person => {
      return peopleIds.indexOf(person.originalId) !== -1
    })

    // find original content creator
    const author = allPeople.find(person => {
      return person.originalId === content.history.createdBy.accountId
    })

    const data: ConfluenceBitData = {
      content: cleanHtml,
    }

    return this.utils.createBit({
      type: 'document',
      originalId: content.id,
      title: content.title,
      author,
      body,
      data,
      location: {
        id: content.space.id,
        name: content.space.name,
        webLink: appData.setup.domain + '/wiki' + content.space._links.webui,
        desktopLink: '',
      },
      webLink: appData.setup.domain + '/wiki' + content._links.webui,
      people,
      bitCreatedAt,
      bitUpdatedAt,
    })
  }

  /**
   * Creates a person bit.
   */
  createPersonBit(user: ConfluenceUser): Bit {
    const appData: ConfluenceAppData = this.app.data

    return this.utils.createBit({
      type: 'person',
      originalId: user.accountId,
      title: user.displayName,
      email: user.details.personal.email,
      photo: appData.setup.domain + user.profilePicture.path.replace('s=48', 's=512'),
    })
  }
}
