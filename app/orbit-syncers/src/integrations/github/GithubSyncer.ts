import { BitEntity, PersonBitEntity, PersonEntity, SettingEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { PersonBitUtils } from '@mcro/model-utils'
import { GithubSetting, GithubSettingValues, GithubSettingValuesLastSyncRepositoryInfo } from '@mcro/models'
import { GithubIssue, GithubLoader, GithubPullRequest } from '@mcro/services'
import { hash } from '@mcro/utils'
import { getRepository } from 'typeorm'
import { IntegrationSyncer } from '../../core/IntegrationSyncer'
import { GithubBitFactory } from './GithubBitFactory'
import { GithubPersonFactory } from './GithubPersonFactory'

/**
 * Syncs Github.
 *
 * One important note regarding to github bits syncing - issues and PRs in github never be removed,
 * which means we never remove github bits during regular sync.
 * We only remove when some setting change (for example user don't sync specific repository anymore).
 */
export class GithubSyncer implements IntegrationSyncer {
  private log: Logger
  private setting: GithubSetting
  private loader: GithubLoader
  private bitFactory: GithubBitFactory
  private personFactory: GithubPersonFactory

  constructor(setting: GithubSetting, log?: Logger) {
    this.setting = setting
    this.log = log || new Logger('syncer:github:' + setting.id)
    this.loader = new GithubLoader(setting, this.log)
    this.bitFactory = new GithubBitFactory(setting)
    this.personFactory = new GithubPersonFactory(setting)
  }

  /**
   * Runs synchronization process.
   */
  async run() {

    // if no repositories were selected in settings, we don't do anything
    const repositories = await this.loadApiRepositories()
    if (!repositories.length) {
      this.log.info(`no repositories were selected in the settings, skip sync`)
      return
    }

    // initial default settings
    if (!this.setting.values.lastSyncIssues) this.setting.values.lastSyncIssues = {}
    if (!this.setting.values.lastSyncPullRequests) this.setting.values.lastSyncPullRequests = {}

    // go through all repositories and sync them all
    this.log.timer(`load api bits and people`)
    for (let repository of repositories) {

      if (!this.setting.values.lastSyncIssues[repository.nameWithOwner])
        this.setting.values.lastSyncIssues[repository.nameWithOwner] = {}
      if (!this.setting.values.lastSyncPullRequests[repository.nameWithOwner])
        this.setting.values.lastSyncPullRequests[repository.nameWithOwner] = {}

      const lastSyncIssues = this.setting.values.lastSyncIssues[repository.nameWithOwner]
      const lastSyncPullRequests = this.setting.values.lastSyncPullRequests[repository.nameWithOwner]
      const [organization, repositoryName] = repository.nameWithOwner.split('/')

      // compare repository's first issue updated date with our last synced date to make sure
      // something has changed since our last sync. If nothing was changed we skip issues sync
      if (lastSyncIssues.lastSyncedDate &&
          repository.issues.nodes.length &&
          new Date(repository.issues.nodes[0].updatedAt).getTime() === lastSyncIssues.lastSyncedDate) {
        this.log.verbose(`looks like nothing was changed in a ${repository.nameWithOwner} repository issues from our last sync, skipping`)

      } else {
        // load repository issues and sync them in a stream
        this.log.timer(`sync ${repository.nameWithOwner} issues`)
        await this.loader.loadIssues({
          organization,
          repository: repositoryName,
          cursor: lastSyncIssues.lastCursor,
          loadedCount: lastSyncIssues.lastCursorLoadedCount || 0,
          handler: (issue, cursor, loadedCount, lastIssue) => {
            return this.handleIssueOrPullRequest({
              issueOrPullRequest: issue,
              organization,
              repositoryName,
              cursor,
              loadedCount,
              lastIssue,
              lastSyncInfo: lastSyncIssues,
            })
          }
        })
        this.log.timer(`sync ${repository.nameWithOwner} issues`)
      }

      // compare repository's first PR updated date with our last synced date to make sure
      // something has changed since our last sync. If nothing was changed we skip PRs sync
      if (lastSyncPullRequests.lastSyncedDate &&
        repository.pullRequests.nodes.length &&
        new Date(repository.pullRequests.nodes[0].updatedAt).getTime() === lastSyncPullRequests.lastSyncedDate) {
        this.log.verbose(`looks like nothing was changed in a ${repository.nameWithOwner} repository PRs from our last sync, skipping`)

      } else {
        // load repository pull requests and sync them in a stream
        this.log.timer(`sync ${repository.nameWithOwner} pull requests`)
        await this.loader.loadPullRequests({
          organization,
          repository: repositoryName,
          cursor: lastSyncPullRequests.lastCursor,
          loadedCount: lastSyncPullRequests.lastCursorLoadedCount || 0,
          handler: (issue, cursor, loadedCount, lastIssue) => {
            return this.handleIssueOrPullRequest({
              issueOrPullRequest: issue,
              organization,
              repositoryName,
              cursor,
              loadedCount,
              lastIssue,
              lastSyncInfo: lastSyncPullRequests,
            })
          }
        })
        this.log.timer(`sync ${repository.nameWithOwner} pull requests`)
      }

    }
    this.log.timer(`load api bits and people`)

    // todo: make a person cleanup
  }

  /**
   * Handles a single issue or pull request from loaded issues/PRs stream.
   */
  private async handleIssueOrPullRequest(options?: {
    issueOrPullRequest: GithubIssue | GithubPullRequest
    organization: string
    repositoryName: string
    cursor: string
    loadedCount: number
    lastIssue: boolean
    lastSyncInfo: GithubSettingValuesLastSyncRepositoryInfo
  }) {
    const { issueOrPullRequest, organization, repositoryName, cursor, loadedCount, lastIssue, lastSyncInfo } = options
    const updatedAt = new Date(issueOrPullRequest.updatedAt).getTime()

    // if we have synced stuff previously already, we need to prevent same issues syncing
    // check if issue's updated date is newer than our last synced date
    if (lastSyncInfo.lastSyncedDate && updatedAt <= lastSyncInfo.lastSyncedDate) {
      this.log.verbose(`reached last synced date, stop syncing...`, { issueOrPullRequest, updatedAt, lastSyncInfo })

      // if its actually older we don't need to sync this issue and all next ones (since they are sorted by updated date)
      if (lastSyncInfo.lastCursorSyncedDate) { // important check, because we can be in this block without loading by cursor
        lastSyncInfo.lastSyncedDate = lastSyncInfo.lastCursorSyncedDate
      }
      lastSyncInfo.lastCursor = undefined
      lastSyncInfo.lastCursorSyncedDate = undefined
      lastSyncInfo.lastCursorLoadedCount = undefined
      await getRepository(SettingEntity).save(this.setting)

      return false // this tells from the callback to stop issue proceeding
    }

    // for the first ever synced issue we store its updated date, and once sync is done,
    // next time we make sync again we don't want to sync issues less then this date
    if (!lastSyncInfo.lastCursorSyncedDate) {
      lastSyncInfo.lastCursorSyncedDate = updatedAt
      this.log.verbose(`looks like its the first syncing issue, set last synced date`, lastSyncInfo)
      await getRepository(SettingEntity).save(this.setting)
    }

    const comments = issueOrPullRequest.comments.totalCount > 0 ? await this.loader.loadComments(organization, repositoryName, issueOrPullRequest.number) : []

    // load issue bit from the database
    const bit = this.bitFactory.createFromIssue(issueOrPullRequest, comments)
    bit.people = this.personFactory.createFromIssue(issueOrPullRequest)

    // for people without emails we create "virtual" email
    for (let person of bit.people) {
      if (!person.email) {
        person.email = person.name + ' from ' + person.integration
      }
    }

    // find person bit with email
    const personBits = await Promise.all(bit.people.map(async person => {
      const dbPersonBit = await getRepository(PersonBitEntity).findOne(hash(person.email))
      const newPersonBit = PersonBitUtils.createFromPerson(person)
      const personBit = PersonBitUtils.merge(newPersonBit, dbPersonBit || {})

      // push person to person bit's people
      const hasPerson = personBit.people.some(existPerson => existPerson.id === person.id)
      if (!hasPerson) {
        personBit.people.push(person)
      }

      return personBit
    }))

    this.log.verbose(`syncing`, { issueOrPullRequest, bit, people: bit.people, personBits })
    await getRepository(PersonEntity).save(bit.people, { listeners: false })
    await getRepository(PersonBitEntity).save(personBits, { listeners: false })
    await getRepository(BitEntity).save(bit, { listeners: false })

    // in the case if its the last issue we need to cleanup last cursor stuff and save last synced date
    if (lastIssue) {
      this.log.verbose(`looks like its the last issue in this sync, removing last cursor and setting last sync date`, lastSyncInfo)
      lastSyncInfo.lastSyncedDate = lastSyncInfo.lastCursorSyncedDate
      lastSyncInfo.lastCursor = undefined
      lastSyncInfo.lastCursorSyncedDate = undefined
      lastSyncInfo.lastCursorLoadedCount = undefined
      await getRepository(SettingEntity).save(this.setting)
      return true
    }

    // update last sync settings to make sure we continue from the last point in the case if application will stop
    if (lastSyncInfo.lastCursor !== cursor) {
      this.log.verbose(`updating last cursor in settings`, { cursor })
      lastSyncInfo.lastCursor = cursor
      lastSyncInfo.lastCursorLoadedCount = loadedCount
      await getRepository(SettingEntity).save(this.setting)
    }

    return true
  }

  /**
   * Loads repositories from the github api.
   * Gets into count whitelisted repositories.
   */
  private async loadApiRepositories() {

    // load repositories from the API first
    this.log.timer(`load API repositories`)
    let repositories = [] // await this.loader.loadUserRepositories()
    this.log.timer(`load API repositories`, repositories)

    // get whitelist, if its not defined just return all loaded repositories
    const values = this.setting.values as GithubSettingValues
    if (values.whitelist !== undefined) {
      this.log.info(`whitelist is defined, filtering settings by a whitelist`, values.whitelist)
      repositories = repositories.filter(repository => {
        return values.whitelist.indexOf(repository.nameWithOwner) !== -1
      });
      this.log.info(`filtered repositories by whitelist`, repositories)
    }

    // if it was defined return filtered repositories
    values.externalRepositories = [/*'motion/orbit', */'mobxjs/mobx-state-tree', 'Microsoft/TypeScript']
    if (values.externalRepositories && values.externalRepositories.length > 0) {
      this.log.info(`externalRepositories are found, adding them as well`, values.externalRepositories)
      repositories.push(...await this.loader.loadRepositories(values.externalRepositories))
    }

    return repositories
  }

}
