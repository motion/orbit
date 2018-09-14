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
import { GithubLoader } from './GithubLoader'
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

    const values = this.setting.values as GithubSettingValues
    const repositoryPaths = Object.keys(values.repos/* || {
      "typeorm/javascript-example": true,
      "typeorm/browser-example": true,
      "typeorm/typeorm": true,
    }*/)

    // if no repositories were selected in settings, we don't do anything
    if (!repositoryPaths.length) {
      log.verbose(`no repositories were selected in the settings, skip sync`)
      return
    } else {
      log.verbose(`syncing following repositories`, repositoryPaths)
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
    for (let repositoryPath of repositoryPaths) {
      const [organization, repository] = repositoryPath.split('/')
      const issues = await this.loader.loadIssues(organization, repository)
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
