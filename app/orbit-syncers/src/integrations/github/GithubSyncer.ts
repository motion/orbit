import { Logger } from '@mcro/logger'
import { Bit, GithubSettingValues, Person, Setting } from '@mcro/models'
import { GithubLoader, GithubRepository } from '@mcro/services'
import { IntegrationSyncer } from '../../core/IntegrationSyncer'
import { BitSyncer } from '../../utils/BitSyncer'
import { PersonSyncer } from '../../utils/PersonSyncer'
import { SyncerRepository } from '../../utils/SyncerRepository'
import { GithubBitFactory } from './GithubBitFactory'
import { GithubPersonFactory } from './GithubPersonFactory'

/**
 * Syncs Github.
 */
export class GithubSyncer implements IntegrationSyncer {
  private log: Logger
  private setting: Setting
  private loader: GithubLoader
  private bitFactory: GithubBitFactory
  private personFactory: GithubPersonFactory
  private personSyncer: PersonSyncer
  private bitSyncer: BitSyncer
  private syncerRepository: SyncerRepository

  constructor(setting: Setting, log?: Logger) {
    this.setting = setting
    this.log = log || new Logger('syncer:github:' + setting.id)
    this.loader = new GithubLoader(setting)
    this.bitFactory = new GithubBitFactory(setting)
    this.personFactory = new GithubPersonFactory(setting)
    this.personSyncer = new PersonSyncer(setting, this.log)
    this.bitSyncer = new BitSyncer(setting, this.log)
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
    const apiBits: Bit[] = []
    const apiPeople: Person[] = []
    for (let repository of repositories) {
      const [organization, repositoryName] = repository.nameWithOwner.split('/')
      const issues = await this.loader.loadIssues(organization, repositoryName)
      this.log.timer(`loading ${repository.nameWithOwner} issues`)
      for (let issue of issues) {
        const bit = this.bitFactory.createFromIssue(issue)
        bit.people = this.personFactory.createFromIssue(issue)
        apiBits.push(bit)
        apiPeople.push(...bit.people)
      }
      this.log.timer(`loading ${repository.nameWithOwner} issues`, issues)
      this.log.timer(`loading ${repository.nameWithOwner} pull requests`)
      const prs = await this.loader.loadPullRequests(organization, repositoryName)
      for (let pr of prs) {
        const bit = this.bitFactory.createFromIssue(pr)
        bit.people = this.personFactory.createFromPullRequest(pr)
        apiBits.push(bit)
        apiPeople.push(...bit.people)
      }
      this.log.timer(`loading ${repository.nameWithOwner} pull requests`, prs)
    }
    this.log.timer(`load api bits and people`, { apiBits, apiPeople })

    // sync people and bits
    await this.personSyncer.sync({ apiPeople, dbPeople, dbPersonBits })
    await this.bitSyncer.sync({ apiBits, dbBits })

  }

  /**
   * Loads repositories from the github api.
   * Gets into count whitelisted repositories.
   */
  private async loadApiRepositories() {
    
    // load repositories from the API first
    this.log.timer(`load API repositories`)
    let repositories = await this.loader.loadRepositories()
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
    if (values.externalRepositories && values.externalRepositories.length > 0) {
      this.log.info(`externalRepositories are found, adding them as well`, values.externalRepositories)
      repositories.push(...values.externalRepositories.map(repository => {
        return {
          nameWithOwner: repository
        } as GithubRepository
      }))
    }

    return repositories
  }

}
