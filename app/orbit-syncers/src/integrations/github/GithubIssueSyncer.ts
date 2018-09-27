import { BitEntity, PersonEntity, SettingEntity } from '@mcro/entities'
import { PersonBitEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { GithubSettingValues, Person } from '@mcro/models'
import { GithubLoader } from '@mcro/services'
import { getRepository, In } from 'typeorm'
import { IntegrationSyncer } from '../../core/IntegrationSyncer'
import { BitSyncer } from '../../utils/BitSyncer'
import { PersonSyncer } from '../../utils/PersonSyncer'
import { GithubBitFactory } from './GithubBitFactory'
import { GithubPersonFactory } from './GithubPersonFactory'

export class GithubIssueSyncer implements IntegrationSyncer {
  private log: Logger
  private setting: SettingEntity
  private loader: GithubLoader
  private bitFactory: GithubBitFactory
  private personFactory: GithubPersonFactory

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.log = new Logger('syncer:github:' + this.setting.id)
    this.loader = new GithubLoader(setting)
    this.bitFactory = new GithubBitFactory(setting)
    this.personFactory = new GithubPersonFactory(setting)
  }

  async run() {

    // if no repositories were selected in settings, we don't do anything
    const repositories = await this.loadApiRepositories()
    if (!repositories.length) {
      this.log.info(`no repositories were selected in the settings, skip sync`)
      return
    }

    // load database data
    this.log.timer(`load people, person bits and bits from the database`)
    const dbPeople = await this.loadDatabasePeople()
    const dbPersonBits = await this.loadDatabasePersonBits(dbPeople)
    const dbBits = await this.loadDatabaseBits()
    this.log.timer(`load people, person bits and bits from the database`, { dbPeople, dbPersonBits, dbBits })

    // sync each repository
    this.log.timer(`load api bits and people`)
    const apiBits: BitEntity[] = []
    const apiPeople: Person[] = []
    for (let repository of repositories) {
      const [organization, repositoryName] = repository.nameWithOwner.split('/')
      const issues = await this.loader.loadIssues(organization, repositoryName)
      for (let issue of issues) {
        const bit = this.bitFactory.create(issue)
        bit.people = this.personFactory.createFromIssue(issue)
        apiBits.push(bit)
        apiPeople.push(...bit.people)
      }
    }
    this.log.timer(`load api bits and people`, { apiBits, apiPeople })

    // saving all the people and bits
    await PersonSyncer.sync({
      log: this.log,
      apiPeople,
      dbPeople,
      dbPersonBits,
    })
    await BitSyncer.sync(this.log, apiBits, dbBits)
  }

  /**
   * Loads repositories from the github api.
   * Gets into count whitelisted repositories.
   */
  private async loadApiRepositories() {
    
    // load repositories from the API first
    this.log.timer(`load repositories`)
    const repositories = await this.loader.loadRepositories()
    this.log.timer(`load repositories`, repositories)
    
    // get whitelist, if its not defined just return all loaded repositories 
    const values = this.setting.values as GithubSettingValues
    if (values.whitelist === undefined) {
      this.log.verbose(`no whitelist is set for this setting, syncing them all`)
      return repositories
    }

    // if it was defined return filtered repositories
    const filtered = repositories.filter(repository => {
      return values.whitelist.indexOf(repository.nameWithOwner) !== -1
    });
    this.log.info(`filtered repositories`, filtered)
    return filtered
  }

  /**
   * Loads bits in a given period.
   */
  private loadDatabaseBits() {
    return getRepository(BitEntity).find({
      select: {
        id: true,
        contentHash: true
      },
      where: {
        settingId: this.setting.id
      }
    })
  }

  /**
   * Loads all exist database people for the current integration.
   */
  private loadDatabasePeople() {
    return getRepository(PersonEntity).find({
      // select: {
      //   id: true,
      //   contentHash: true
      // },
      // relations: {
      //   personBit: true
      // },
      where: {
        settingId: this.setting.id
      }
    })
  }

  /**
   * Loads all exist database person bits for the given people.
   */
  private loadDatabasePersonBits(people: Person[]) {
    return getRepository(PersonBitEntity).find({
      // select: {
      //   email: true,
      //   contentHash: true
      // },
      relations: {
        people: true
      },
      where: {
        email: In(people.map(person => person.email))
      }
    })
  }

}
