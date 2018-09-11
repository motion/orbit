import { Logger } from '@mcro/logger'
import { getRepository } from 'typeorm'
import { PersonEntity } from '../../entities/PersonEntity'
import { timeout } from '../../utils'

const createDOMPurify = require('dompurify')
const JSDOM = require('jsdom').JSDOM
const window = (new JSDOM('')).window
const DOMPurify = createDOMPurify(window)

/**
 * Common utils for syncers.
 */
export class SyncerUtils {

  /**
   * Loads all people from the given integration.
   * This is a common task across all integrations
   * and it implements an important behaviour -
   * when user adds a new integration - both user and content
   * syncers getting run in parallel and if content syncer needs people
   * it might not have them. This function helps creates a delay
   * that allows to wait for a people syncer to finish its job
   * and get people once we have them.
   */
  static async loadPeople(settingId: number, log: Logger): Promise<PersonEntity[]> {

    log.info(`loading database (already synced) people`)
    const people = await getRepository(PersonEntity).find({
      where: {
        settingId: settingId
      },
      relations: {
        personBit: true
      }
    })
    if (people.length) {
      log.info(`loaded database people`, people)
      return people
    }

    // if there are no people it means we run this syncer before people sync,
    // postpone syncer execution
    log.info(`no people were found, looks like people syncer wasn't executed yet, scheduling restart in 10 seconds`)
    return await timeout(10000, () => {
      log.info(`restarting people syncer`)
      return this.loadPeople(settingId, log)
    })
  }

  /**
   * Strips HTML from the given HTML text content.
   */
  static stripHtml(value: string) {
    if (!value) return ''

    return DOMPurify.sanitize(value, { ALLOWED_TAGS: [] })
      .replace(/&nbsp;/gi, ' ')
      .replace(/•/gi, '')
      .trim()
  }

  /**
   * Sanitizes given HTML text content.
   */
  static sanitizeHtml(value: string) {
    if (!value) return ''

    return DOMPurify.sanitize(value).trim()
  }


}
