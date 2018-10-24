import { BitEntity, PersonBitEntity, PersonEntity } from '@mcro/entities'
import { SettingEntity } from '@mcro/entities/_'
import { Logger } from '@mcro/logger'
import { PersonBitUtils } from '@mcro/model-utils'
import { Bit, GithubSetting, GithubSettingValues, Person } from '@mcro/models'
import { GithubSettingValuesLastSyncRepositoryInfo } from '@mcro/models'
import { GithubLoader } from '@mcro/services'
import { hash } from '@mcro/utils'
import { uniqBy } from 'lodash'
import { getRepository, In, Not } from 'typeorm'
import { IntegrationSyncer } from '../../core/IntegrationSyncer'
import { SyncerRepository } from '../../utils/SyncerRepository'
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
  // private personSyncer: PersonSyncer
  // private bitSyncer: BitSyncer
  private syncerRepository: SyncerRepository

  constructor(setting: GithubSetting, log?: Logger) {
    this.setting = setting
    this.log = log || new Logger('syncer:github:' + setting.id)
    this.loader = new GithubLoader(setting, this.log)
    this.bitFactory = new GithubBitFactory(setting)
    this.personFactory = new GithubPersonFactory(setting)
    // this.personSyncer = new PersonSyncer(setting, this.log)
    // this.bitSyncer = new BitSyncer(setting, this.log)
    this.syncerRepository = new SyncerRepository(setting)
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

    // load database data
    this.log.timer(`load people, person bits and bits from the database`)
    const dbPeople = await this.syncerRepository.loadDatabasePeople()
    const dbPersonBits = await this.syncerRepository.loadDatabasePersonBits({ people: dbPeople })
    const dbBits = await this.syncerRepository.loadDatabaseBits()
    this.log.timer(`load people, person bits and bits from the database`, { dbPeople, dbPersonBits, dbBits })

    // load api data for each repository
    this.log.timer(`load api bits and people`)
    // const bitIds: number[] = [],
    //   peopleIds: number[] = [],
    //   personBitIds: number[] = []

    const apiBits: Bit[] = []
    const apiPeople: Person[] = []
    if (!this.setting.values.lastSyncRepositories) this.setting.values.lastSyncRepositories = {}
    for (let repository of repositories) {
      this.log.timer(`sync ${repository.nameWithOwner} issues`)
      const [organization, repositoryName] = repository.nameWithOwner.split('/')
      if (!this.setting.values.lastSyncRepositories[repository.nameWithOwner]) {
        this.setting.values.lastSyncRepositories[repository.nameWithOwner] = {}
      }
      const lastSyncInfo = this.setting.values.lastSyncRepositories[repository.nameWithOwner]

      // DEPRECATED: WE DO NOT NEED THIS CODE. IT ONLY BRINGS PROBLEMS - FOR HUGE REPOSITORIES IT TAKES FOREVER TO LOAD THEIR ISSUES
      // AND SINCE THEY ARE HUGE THEY ARE POPULAR AND NEW ISSUES KEEP COMING. LET IT JUST SYNC, WE WILL GET NEW ISSUES ON NEXT SYNC ITERATION
      // if we have a last sync cursor left (means we need to continue syncing from that position)
      // load the total count of issues in the repository first
      // to compare it with the total number of issues we used last time
      // if total number of issues differs it means some new issues were added
      // and we can't use our last synced date because otherwise we'll miss those newly added issues
      // if (lastSyncInfo.lastCursorTotalCount && repository.issues.totalCount !== lastSyncInfo.lastCursorTotalCount) {
      //   this.log.verbose(`looks like repository got new issues since last cursor, resetting cursor, starting sync from the beginning`)
      //   lastSyncInfo.lastCursor = undefined
      //   lastSyncInfo.lastCursorSyncedDate = undefined
      //   lastSyncInfo.lastCursorLoadedCount = undefined
      //   lastSyncInfo.lastCursorTotalCount = undefined
      //   await getRepository(SettingEntity).save(this.setting)
      // }

      if (lastSyncInfo.lastSyncedDate &&
          repository.issues.nodes.length &&
          new Date(repository.issues.nodes[0].updatedAt).getTime() === lastSyncInfo.lastSyncedDate) {
        this.log.verbose(`looks like nothing was changed in a repository from our last sync, skipping`)
        continue
      }

      await this.loader.loadIssues(organization, repositoryName, lastSyncInfo.lastCursor, lastSyncInfo.lastCursorLoadedCount || 0, async (issue, cursor, loadedCount, lastIssue) => {
        const updatedAt = new Date(issue.updatedAt).getTime()

        // if we have synced stuff previously already, we need to prevent same issues syncing
        // check if issue's updated date is newer than our last synced date
        this.log.verbose(`checking when issue was updated last time`, { lastSyncInfo, updatedAt, issue })
        if (lastSyncInfo.lastSyncedDate && updatedAt <= lastSyncInfo.lastSyncedDate) {
          this.log.verbose(`reached last synced date, stop syncing...`, { issue, updatedAt, lastSyncInfo })

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

        // for the first ever synced issue we store its updated date, and next time we make sync again
        // we don't want to sync issues less then this date
        if (!lastSyncInfo.lastCursorSyncedDate) {
          lastSyncInfo.lastCursorSyncedDate = updatedAt
          this.log.verbose(`looks like its the first syncing issue, set last synced date`, lastSyncInfo)
          await getRepository(SettingEntity).save(this.setting)
        }

        const comments = issue.comments.totalCount > 0 ? await this.loader.loadComments(organization, repositoryName, issue.number) : []

        // load issue bit from the database
        // const bitId = hash(`github-${this.setting.id}-${issue.id}`)
        // const dbBit = await getRepository(BitEntity).findOne(bitId)

        const bit = this.bitFactory.createFromIssue(issue, comments)
        bit.people = this.personFactory.createFromIssue(issue)
        apiBits.push(bit)
        apiPeople.push(...bit.people)

        // remove people duplicates
        bit.people = uniqBy(bit.people, person => person.id)

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

        this.log.verbose(`syncing`, { issue, bit, people: bit.people, personBits })
        await getRepository(PersonEntity).save(bit.people)
        await getRepository(PersonBitEntity).save(personBits)
        await getRepository(BitEntity).save(bit)

        // bitIds.push(bit.id)
        // peopleIds.push(...bit.people.map(person => person.id))
        // personBitIds.push(...personBits.map(personBit => personBit.id))

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
      })

      this.log.timer(`sync ${repository.nameWithOwner} issues`)
    }
    this.log.timer(`load api bits and people`, { apiBits, apiPeople })

    // since we never load all issues (we load only until we face last synced one by its updation date)
    // we can't know if we have issues removed before that updation date

    // removing not loaded bits and people
    /*const removedBits = await getRepository(BitEntity).find({
      where: {
        id: Not(In(bitIds)),
        settingId: this.setting.id,
      }
    })
    const removedPeople = await getRepository(PersonEntity).find({
      where: {
        id: Not(In(peopleIds)),
        settingId: this.setting.id,
      }
    })
    const allDbPersonBits = await getRepository(PersonBitEntity).find({
      relations: {
        people: true
      }
    })
    const removedPersonBits = allDbPersonBits.filter(personBit => personBit.people.length === 0)

    this.log.timer(`remove old synced data`, { removedBits, removedPeople, removedPersonBits })
    await getRepository(BitEntity).remove(removedBits)
    await getRepository(PersonEntity).remove(removedPeople)
    await getRepository(PersonBitEntity).remove(removedPersonBits)
    this.log.timer(`remove old synced data`)*/
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
