import { AppEntity, Bit, BitEntity } from '@mcro/models'
import { sleep } from '@mcro/utils'
import {
  BitUtils,
  createSyncer,
  getEntityManager,
  isAborted,
  loadDatabasePeople,
  sanitizeHtml,
  stripHtml,
  syncPeople,
} from '@mcro/sync-kit'
import { JiraAppData } from './JiraAppData'
import { JiraBitData } from './JiraBitData'
import { JiraIssue, JiraUser } from './JiraTypes'
import { JiraLoader } from './JiraLoader'

/**
 * Syncs Jira issues.
 */
export const JiraSyncer = createSyncer(async ({ app, log }) => {

  const loader = new JiraLoader(app, log)

  /**
   * Checks if confluence user is acceptable and can be used to create person entity from.
   */
  const checkUser = (user: JiraUser): boolean => {
    const email = user.emailAddress || ''
    const ignoredEmail = '@connect.atlassian.com'
    return email.substr(ignoredEmail.length * -1) !== ignoredEmail
  }

  /**
   * Builds a bit from the given jira issue.
   */
  const createDocumentBit = (issue: JiraIssue, allPeople: Bit[]): Bit => {
    const bitCreatedAt = new Date(issue.fields.created).getTime()
    const bitUpdatedAt = new Date(issue.fields.updated).getTime()
    const values = (app.data as JiraAppData).values['data']['values']
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
    return BitUtils.create(
      {
        appIdentifier: 'jira',
        appId: app.id,
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
  const createPersonBit = (user: JiraUser): Bit => {
    return BitUtils.create(
      {
        appIdentifier: 'jira',
        appId: app.id,
        type: 'person',
        originalId: user.accountId,
        title: user.displayName,
        email: user.emailAddress,
        photo: user.avatarUrls['48x48'].replace('s=48', 's=512'),
      },
      user.accountId,
    )
  }

  if (!app.data.values.lastSync) app.data.values.lastSync = {}
  const lastSync = app.data.values.lastSync

  // load database data
  log.timer('load people, person bits and bits from the database')
  const dbPeople = await loadDatabasePeople(app)
  log.timer('load people, person bits and bits from the database', dbPeople)

  // load users from jira API
  log.timer('load API people')
  const apiUsers = await loader.loadUsers()
  log.timer('load API people', apiUsers)

  // we don't need some jira users, like system or bot users
  // so we are filtering them out
  log.info("filter out users we don't need")
  const filteredUsers = apiUsers.filter(user => checkUser(user))
  log.info('updated users after filtering', filteredUsers)

  // create people for loaded user
  log.info('creating people for api users')
  const apiPeople = filteredUsers.map(user => createPersonBit(user))
  log.info('people created', apiPeople)

  // saving people and person bits
  await syncPeople(app, apiPeople, dbPeople)

  // load all people (once again after sync)
  const allDbPeople = await loadDatabasePeople(app)

  // load users from API
  log.timer('load issues from API')
  const files = await loader.loadIssues(
    lastSync.lastCursor || 0,
    lastSync.lastCursorLoadedCount || 0,
    async (issue, cursor, loadedCount, isLast) => {
      await isAborted(app)
      await sleep(2)

      const updatedAt = new Date(issue.fields.updated).getTime()

      // if we have synced stuff previously already, we need to prevent same issues syncing
      // check if issue's updated date is newer than our last synced date
      if (lastSync.lastSyncedDate && updatedAt <= lastSync.lastSyncedDate) {
        log.info('reached last synced date, stop syncing...', { issue, updatedAt, lastSync })

        // if its actually older we don't need to sync this issue and all next ones (since they are sorted by updated date)
        if (lastSync.lastCursorSyncedDate) {
          // important check, because we can be in this block without loading by cursor
          lastSync.lastSyncedDate = lastSync.lastCursorSyncedDate
        }
        lastSync.lastCursor = undefined
        lastSync.lastCursorSyncedDate = undefined
        await getEntityManager().getRepository(AppEntity).save(app)

        return false // this tells from the callback to stop file proceeding
      }

      // for the first ever synced issue we store its updated date, and once sync is done,
      // next time we make sync again we don't want to sync issues less then this date
      if (!lastSync.lastCursorSyncedDate) {
        lastSync.lastCursorSyncedDate = updatedAt
        log.info('looks like its the first syncing issue, set last synced date', lastSync)
        await getEntityManager().getRepository(AppEntity).save(app)
      }

      const bit = createDocumentBit(issue, allDbPeople)
      log.verbose('syncing', { issue, bit, people: bit.people })
      await getEntityManager().getRepository(BitEntity).save(bit, { listeners: false })

      // in the case if its the last issue we need to cleanup last cursor stuff and save last synced date
      if (isLast) {
        log.info(
          'looks like its the last issue in this sync, removing last cursor and source last sync date',
          lastSync,
        )
        lastSync.lastSyncedDate = lastSync.lastCursorSyncedDate
        lastSync.lastCursor = undefined
        lastSync.lastCursorSyncedDate = undefined
        await getEntityManager().getRepository(AppEntity).save(app)
        return true
      }

      // update last sync settings to make sure we continue from the last point in the case if application will stop
      if (lastSync.lastCursor !== cursor) {
        log.info('updating last cursor in settings', { cursor })
        lastSync.lastCursor = cursor
        lastSync.lastCursorLoadedCount = loadedCount
        await getEntityManager().getRepository(AppEntity).save(app)
      }

      return true
    },
  )
  log.timer('load issues from API', files)
})
