import { Logger } from '@mcro/logger'
import { Bit, GithubBitData, GithubSettingValues, Person } from '@mcro/models'
import { getRepository } from 'typeorm'
import { BitEntity } from '../../entities/BitEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { BitUtils } from '../../utils/BitUtils'
import { PersonUtils } from '../../utils/PersonUtils'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { SyncerUtils } from '../core/SyncerUtils'
import { GithubBitFactory } from './GithubBitFactory'
import { GithubLoader } from '../../loaders/github/GithubLoader'
import { GithubPersonFactory } from './GithubPersonFactory'

const log = new Logger('syncer:github:issues')

export class GithubIssueSyncer implements IntegrationSyncer {
  private setting: SettingEntity
  private loader: GithubLoader
  private bitFactory: GithubBitFactory
  private personFactory: GithubPersonFactory

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.loader = new GithubLoader(setting)
    this.bitFactory = new GithubBitFactory(setting)
    this.personFactory = new GithubPersonFactory(setting)
  }

  async run() {

    // if no repositories were selected in settings, we don't do anything
    const repositories = await this.loadRepositories()
    if (!repositories.length) {
      log.verbose(`no repositories were selected in the settings, skip sync`)
      return
    } else {
      log.verbose(`syncing following repositories`, repositories)
    }

    // load database people
    log.timer(`load database people`)
    const dbPeople = await SyncerUtils.loadPeople(this.setting.id, log)
    log.timer(`load database people`, dbPeople)

    // load database people
    log.timer(`load database bits`)
    const dbBits = await this.loadDatabaseBits()
    log.timer(`load database bits`, dbBits)

    // sync each repository
    log.timer(`load api bits and people`)
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
    log.timer(`load api bits and people`, { apiBits, apiPeople })

    // saving all the people and bits
    await PersonUtils.sync(log, apiPeople, dbPeople, { skipRemove: true })
    await BitUtils.sync(log, apiBits, dbBits)
  }

  /**
   * Loads repositories from the github api.
   * Gets into count whitelisted repositories.
   */
  private async loadRepositories() {
    const values = this.setting.values as GithubSettingValues
    const repositories = await this.loader.loadRepositories()
    if (values.whitelist === undefined)
      return repositories

    return repositories.filter(repository => {
      return values.whitelist.indexOf(repository.nameWithOwner) === -1
    });
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

}
