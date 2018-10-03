import { BitUtils } from '@mcro/model-utils'
import { Bit, ConfluenceBitData, ConfluenceSettingValues, Person, Setting } from '@mcro/models'
import { ConfluenceContent } from '@mcro/services'
import { SyncerUtils } from '../../core/SyncerUtils'

/**
 * Creates a Confluence Bit.
 */
export class ConfluenceBitFactory {
  private setting: Setting

  constructor(setting: Setting) {
    this.setting = setting
  }

  /**
   * Builds a bit from the given confluence content.
   */
  create(content: ConfluenceContent, allPeople: Person[]): Bit {
    const values = this.setting.values as ConfluenceSettingValues
    const domain = values.credentials.domain
    const bitCreatedAt = new Date(content.history.createdDate).getTime()
    const bitUpdatedAt = new Date(content.history.lastUpdated.when).getTime()
    const body = SyncerUtils.stripHtml(content.body.styled_view.value)
    let cleanHtml = SyncerUtils.sanitizeHtml(content.body.styled_view.value)
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
      return peopleIds.indexOf(person.integrationId) !== -1
    })

    // find original content creator
    const author = allPeople.find(person => {
      return person.integrationId === content.history.createdBy.accountId
    })

    // create or update a bit
    return BitUtils.create({
      integration: 'confluence',
      setting: this.setting,
      type: 'document',
      title: content.title,
      author,
      body,
      data: { content: cleanHtml } as ConfluenceBitData,
      raw: content,
      location: {
        id: content.space.id,
        name: content.space.name,
        webLink: domain + '/wiki' + content.space._links.webui,
        desktopLink: '',
      },
      webLink: domain + '/wiki' + content._links.webui,
      people,
      bitCreatedAt,
      bitUpdatedAt,
    }, content.id)
  }
}
