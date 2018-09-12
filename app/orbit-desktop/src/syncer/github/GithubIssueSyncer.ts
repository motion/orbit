import { Logger } from '@mcro/logger'
import { Bit, GithubBitData, Person } from '@mcro/models'
import { GithubSettingValues } from '@mcro/models'
import { uniqBy } from 'lodash'
import { getRepository } from 'typeorm'
import { BitEntity } from '../../entities/BitEntity'
import { PersonEntity } from '../../entities/PersonEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { createOrUpdatePersonBits } from '../../repository'
import { assign } from '../../utils'
import { BitUtils } from '../../utils/BitUtils'
import { CommonUtils } from '../../utils/CommonUtils'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { SyncerUtils } from '../core/SyncerUtils'
import { GithubLoader } from './GithubLoader'
import { GithubPeopleSyncer } from './GithubPeopleSyncer'
import { GithubIssue } from './GithubTypes'

const log = new Logger('syncer:github:issues')

export class GithubIssueSyncer implements IntegrationSyncer {
  private setting: SettingEntity
  private loader: GithubLoader
  private bits: BitEntity[]
  private people: PersonEntity[]

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.loader = new GithubLoader(setting)
  }

  async run() {

    const allBits: BitEntity[] = []
    const values = this.setting.values as GithubSettingValues
    const repositoryPaths = Object.keys(values.repos || {})

    // if no repositories were selected in settings, we don't do anything
    if (!repositoryPaths.length) {
      log.info(`no repositories were selected in the settings, skip sync`)
      return
    }

    this.people = await SyncerUtils.loadPeople(this.setting.id, log)
    this.bits = await getRepository(BitEntity).find({
      settingId: this.setting.id
    })

    // sync each repository
    for (let repositoryPath of repositoryPaths) {
      const [organization, repository] = repositoryPath.split('/')
      const issues = await this.loader.loadIssues(organization, repository)
      const bits = issues.map(issue => this.createIssue(issue))
      allBits.push(...bits)
    }

    // collect people from the bits we need to save
    // people such as people from comments
    const peopleFromBits: PersonEntity[] = []
    for (let bit of allBits) {
      for (let person of bit.people) {
        const hasSuchPerson = peopleFromBits.find(personFromBit => {
          return personFromBit.id === person.id
        })
        if (!hasSuchPerson) {
          peopleFromBits.push(person as PersonEntity)
        }
      }
    }

    // saving all the people and bits
    log.info(`saving people`, peopleFromBits)
    await getRepository(PersonEntity).save(peopleFromBits, { chunk: 100 })
    log.info(`people were saved, saving their person bits`)
    await createOrUpdatePersonBits(peopleFromBits.filter(person => person.email))
    log.info(`person bits were saved, saving bits`, allBits)
    await getRepository(BitEntity).save(allBits, { chunk: 100 })
    log.info(`bits were saved`)
  }

  private createIssue(issue: GithubIssue): BitEntity {

    const id = CommonUtils.hash(`github-${this.setting.id}-${issue.id}`)
    const createdAt = new Date(issue.createdAt).getTime()
    const updatedAt = new Date(issue.updatedAt).getTime()
    const comments = issue.comments.edges.map(edge => edge.node)

    const githubPeople = uniqBy([
      issue.author,
      ...comments.map(comment => comment.author),
    ], 'id').filter(user => !!user)

    const people: Person[] = []
    for (let githubPerson of githubPeople) {
      people.push(GithubPeopleSyncer.createPerson(this.setting, githubPerson, this.people))
    }

    const data: GithubBitData = {
      body: issue.body,
      comments: issue.comments.edges.map(edge => {
        // note: if user is removed on a github comment will have author set to "null"
        return {
          author: edge.node.author ? {
            avatarUrl: edge.node.author.avatarUrl,
            login: edge.node.author.login,
          } : undefined,
          createdAt: edge.node.createdAt,
          body: edge.node.body,
        }
      }),
    }

    const bit = this.bits.find(bit => bit.id === id)
    return assign(bit || new BitEntity(), BitUtils.create({
      id,
      settingId: this.setting.id,
      integration: 'github',
      type: 'task',
      title: issue.title,
      body: issue.bodyText,
      webLink: issue.url,
      location: {
        id: issue.repository.id,
        name: issue.repository.name,
        webLink: issue.repository.url,
        desktopLink: ''
      },
      data,
      raw: issue,
      bitCreatedAt: createdAt,
      bitUpdatedAt: updatedAt,
      people: people,
    }))
  }
}
