import { Logger } from '@mcro/logger'
import {
  AppEntity,
  Bit,
  BitEntity,
  BitUtils,
  GithubApp,
  GithubAppData,
  GithubAppValuesLastSyncRepositoryInfo,
  GithubBitData,
} from '@mcro/models'
import {
  GithubComment,
  GithubCommit,
  GithubIssue,
  GithubLoader,
  GithubPerson,
  GithubPullRequest,
} from '@mcro/services'
import { hash } from '@mcro/utils'
import { uniqBy } from 'lodash'
import { getRepository } from 'typeorm'
import { AppSyncer } from '../../core/AppSyncer'

/**
 * Syncs Github.
 *
 * One important note regarding to github bits syncing - issues and PRs in github never be removed,
 * which means we never remove github bits during regular sync.
 * We only remove when some app change (for example user don't sync specific repository anymore).
 */
export class GithubSyncer implements AppSyncer {
  private log: Logger
  private app: GithubApp
  private loader: GithubLoader

  constructor(app: GithubApp, log?: Logger) {
    this.app = app
    this.log = log || new Logger('syncer:github:' + app.id)
    this.loader = new GithubLoader(app, this.log)
  }

  /**
   * Runs synchronization process.
   */
  async run() {
    // if no repositories were selected in settings, we don't do anything
    const repositories = await this.loadApiRepositories()
    if (!repositories.length) {
      this.log.info('no repositories were selected in the settings, skip sync')
      return
    }

    // initial default settings
    if (!this.app.data.values.lastSyncIssues) this.app.data.values.lastSyncIssues = {}
    if (!this.app.data.values.lastSyncPullRequests) this.app.data.values.lastSyncPullRequests = {}

    // go through all repositories and sync them all
    this.log.timer('load api bits and people')
    for (let repository of repositories) {
      if (!this.app.data.values.lastSyncIssues[repository.nameWithOwner])
        this.app.data.values.lastSyncIssues[repository.nameWithOwner] = {}
      if (!this.app.data.values.lastSyncPullRequests[repository.nameWithOwner])
        this.app.data.values.lastSyncPullRequests[repository.nameWithOwner] = {}

      const lastSyncIssues = this.app.data.values.lastSyncIssues[repository.nameWithOwner]
      const lastSyncPullRequests = this.app.data.values.lastSyncPullRequests[
        repository.nameWithOwner
      ]
      const [organization, repositoryName] = repository.nameWithOwner.split('/')

      // compare repository's first issue updated date with our last synced date to make sure
      // something has changed since our last sync. If nothing was changed we skip issues sync
      if (
        lastSyncIssues.lastSyncedDate &&
        repository.issues.nodes.length &&
        new Date(repository.issues.nodes[0].updatedAt).getTime() === lastSyncIssues.lastSyncedDate
      ) {
        this.log.verbose(
          `looks like nothing was changed in a ${
            repository.nameWithOwner
          } repository issues from our last sync, skipping`,
        )
      } else {
        // load repository issues and sync them in a stream
        this.log.vtimer(`sync ${repository.nameWithOwner} issues`)
        await this.loader.loadIssues({
          organization,
          repository: repositoryName,
          cursor: lastSyncIssues.lastCursor,
          loadedCount: lastSyncIssues.lastCursorLoadedCount || 0,
          handler: (issue, cursor, loadedCount, isLast) => {
            return this.handleIssueOrPullRequest({
              type: 'issue',
              issueOrPullRequest: issue,
              organization,
              repositoryName,
              cursor,
              loadedCount,
              lastIssue: isLast,
              lastSyncInfo: lastSyncIssues,
            })
          },
        })
        this.log.vtimer(`sync ${repository.nameWithOwner} issues`)
      }

      // compare repository's first PR updated date with our last synced date to make sure
      // something has changed since our last sync. If nothing was changed we skip PRs sync
      if (
        lastSyncPullRequests.lastSyncedDate &&
        repository.pullRequests.nodes.length &&
        new Date(repository.pullRequests.nodes[0].updatedAt).getTime() ===
          lastSyncPullRequests.lastSyncedDate
      ) {
        this.log.verbose(
          `looks like nothing was changed in a ${
            repository.nameWithOwner
          } repository PRs from our last sync, skipping`,
        )
      } else {
        // load repository pull requests and sync them in a stream
        this.log.vtimer(`sync ${repository.nameWithOwner} pull requests`)
        await this.loader.loadPullRequests({
          organization,
          repository: repositoryName,
          cursor: lastSyncPullRequests.lastCursor,
          loadedCount: lastSyncPullRequests.lastCursorLoadedCount || 0,
          handler: (issue, cursor, loadedCount, isLast) => {
            return this.handleIssueOrPullRequest({
              type: 'pull-request',
              issueOrPullRequest: issue,
              organization,
              repositoryName,
              cursor,
              loadedCount,
              lastIssue: isLast,
              lastSyncInfo: lastSyncPullRequests,
            })
          },
        })
        this.log.vtimer(`sync ${repository.nameWithOwner} pull requests`)
      }
    }
    this.log.timer('load api bits and people')

    // todo: make a person cleanup
  }

  /**
   * Handles a single issue or pull request from loaded issues/PRs stream.
   */
  private async handleIssueOrPullRequest(options?: {
    type: 'issue' | 'pull-request'
    issueOrPullRequest: GithubIssue | GithubPullRequest
    organization: string
    repositoryName: string
    cursor: string
    loadedCount: number
    lastIssue: boolean
    lastSyncInfo: GithubAppValuesLastSyncRepositoryInfo
  }) {
    const {
      type,
      issueOrPullRequest,
      organization,
      repositoryName,
      cursor,
      loadedCount,
      lastIssue,
      lastSyncInfo,
    } = options
    const updatedAt = new Date(issueOrPullRequest.updatedAt).getTime()

    // if we have synced stuff previously already, we need to prevent same issues syncing
    // check if issue's updated date is newer than our last synced date
    if (lastSyncInfo.lastSyncedDate && updatedAt <= lastSyncInfo.lastSyncedDate) {
      this.log.info('reached last synced date, stop syncing...', {
        issueOrPullRequest,
        updatedAt,
        lastSyncInfo,
      })

      // if its actually older we don't need to sync this issue and all next ones (since they are sorted by updated date)
      if (lastSyncInfo.lastCursorSyncedDate) {
        // important check, because we can be in this block without loading by cursor
        lastSyncInfo.lastSyncedDate = lastSyncInfo.lastCursorSyncedDate
      }
      lastSyncInfo.lastCursor = undefined
      lastSyncInfo.lastCursorSyncedDate = undefined
      lastSyncInfo.lastCursorLoadedCount = undefined
      await getRepository(AppEntity).save(this.app, { listeners: false })

      return false // this tells from the callback to stop issue proceeding
    }

    // for the first ever synced issue we store its updated date, and once sync is done,
    // next time we make sync again we don't want to sync issues less then this date
    if (!lastSyncInfo.lastCursorSyncedDate) {
      lastSyncInfo.lastCursorSyncedDate = updatedAt
      this.log.info('looks like its the first syncing issue, set last synced date', lastSyncInfo)
      await getRepository(AppEntity).save(this.app, { listeners: false })
    }

    const comments =
      issueOrPullRequest.comments.totalCount > 0
        ? await this.loader.loadComments(organization, repositoryName, issueOrPullRequest.number)
        : []

    // load issue bit from the database
    const bit = this.createTaskBit(issueOrPullRequest, comments)
    if (type === 'issue') {
      bit.people = this.createPersonBitFromIssue(issueOrPullRequest)
    } else {
      // pull request
      bit.people = this.createPersonBitFromPullRequest(issueOrPullRequest as GithubPullRequest)
    }

    this.log.verbose('syncing', { issueOrPullRequest, bit, people: bit.people })
    await getRepository(BitEntity).save(bit.people, { listeners: false })
    await getRepository(BitEntity).save(bit, { listeners: false })

    // in the case if its the last issue we need to cleanup last cursor stuff and save last synced date
    if (lastIssue) {
      this.log.info(
        'looks like its the last issue in this sync, removing last cursor and app last sync date',
        lastSyncInfo,
      )
      lastSyncInfo.lastSyncedDate = lastSyncInfo.lastCursorSyncedDate
      lastSyncInfo.lastCursor = undefined
      lastSyncInfo.lastCursorSyncedDate = undefined
      lastSyncInfo.lastCursorLoadedCount = undefined
      await getRepository(AppEntity).save(this.app, { listeners: false })
      return true
    }

    // update last sync settings to make sure we continue from the last point in the case if application will stop
    if (lastSyncInfo.lastCursor !== cursor) {
      this.log.info('updating last cursor in settings', { cursor })
      lastSyncInfo.lastCursor = cursor
      lastSyncInfo.lastCursorLoadedCount = loadedCount
      await getRepository(AppEntity).save(this.app, { listeners: false })
    }

    return true
  }

  /**
   * Loads repositories from the github api.
   * Gets into count whitelisted repositories.
   */
  private async loadApiRepositories() {
    // load repositories from the API first
    this.log.timer('load API repositories')
    let repositories = await this.loader.loadUserRepositories()
    this.log.timer('load API repositories', repositories)

    // get whitelist, if its not defined just return all loaded repositories
    const values = this.app.data.values as GithubAppData['values']
    if (values.whitelist !== undefined) {
      this.log.info('whitelist is defined, filtering settings by a whitelist', values.whitelist)
      repositories = repositories.filter(repository => {
        return values.whitelist.indexOf(repository.nameWithOwner) !== -1
      })
      this.log.info('filtered repositories by whitelist', repositories)
    }

    // if it was defined return filtered repositories
    // values.externalRepositories = [
    //   /*'motion/orbit', */ 'mobxjs/mobx-state-tree',
    //   'Microsoft/TypeScript',
    // ]
    if (values.externalRepositories && values.externalRepositories.length > 0) {
      this.log.info(
        'externalRepositories are found, adding them as well',
        values.externalRepositories,
      )
      repositories.push(...(await this.loader.loadRepositories(values.externalRepositories)))
    }

    return repositories
  }

  /**
   * Creates a new bit from a given Github issue.
   */
  private createTaskBit(issue: GithubIssue | GithubPullRequest, comments: GithubComment[]): Bit {
    const id = hash(`github-${this.app.id}-${issue.id}`)
    const createdAt = new Date(issue.createdAt).getTime()
    const updatedAt = new Date(issue.updatedAt).getTime()

    const data: GithubBitData = {
      closed: issue.closed,
      body: issue.body,
      comments: comments.map(comment => {
        // note: if user is removed on a github comment will have author set to "null"
        return {
          author: comment.author
            ? {
                avatarUrl: comment.author.avatarUrl,
                login: comment.author.login,
                email: comment.author.email,
              }
            : undefined,
          createdAt: comment.createdAt,
          body: comment.body,
        }
      }),
      author: issue.author
        ? {
            avatarUrl: issue.author.avatarUrl,
            login: issue.author.login,
            email: issue.author.email,
          }
        : undefined,
      labels: issue.labels.edges.map(label => ({
        name: label.node.name,
        description: label.node.description,
        color: label.node.color,
        url: label.node.url,
      })),
    }

    return BitUtils.create({
      id,
      appId: this.app.id,
      appType: 'github',
      type: 'task',
      title: issue.title,
      body: issue.bodyText,
      webLink: issue.url,
      location: {
        id: issue.repository.id,
        name: issue.repository.name,
        webLink: issue.repository.url,
        desktopLink: '',
      },
      data,
      bitCreatedAt: createdAt,
      bitUpdatedAt: updatedAt,
    })
  }

  /**
   * Finds all participated people in a github issue and creates app
   * people from them.
   */
  private createPersonBitFromIssue(issue: GithubIssue): Bit[] {
    return issue.participants.edges
      .map(user => user.node)
      .filter(user => !!user)
      .map(githubPerson => this.createPersonBitFromGithubUser(githubPerson))
  }

  /**
   * Finds all participated people in a github pull request and creates app
   * people from them.
   */
  private createPersonBitFromPullRequest(pr: GithubPullRequest): Bit[] {
    const commits = pr.commits.edges.map(edge => edge.node.commit)
    const reviews = pr.reviews.edges.map(edge => edge.node)

    const githubPeople = uniqBy(
      [
        pr.author,
        ...pr.participants.edges.map(user => user.node),
        ...reviews.map(user => user.author),
        ...commits.filter(commit => !!commit.user).map(commit => commit.user),
      ],
      'id',
    ).filter(user => !!user)

    const usersFromCommit = commits.filter(commit => {
      return !commit.user && githubPeople.find(person => person.email === commit.email)
    })

    return [
      ...githubPeople.map(githubPerson => this.createPersonBitFromGithubUser(githubPerson)),
      ...usersFromCommit.map(commit => this.createPersonBitFromCommit(commit)),
    ]
  }

  /**
   * Creates a single app person from given Github user.
   */
  private createPersonBitFromGithubUser(githubPerson: GithubPerson): Bit {
    return BitUtils.create(
      {
        appType: 'github',
        appId: this.app.id,
        type: 'person',
        originalId: githubPerson.id,
        title: githubPerson.login,
        email: githubPerson.email,
        photo: githubPerson.avatarUrl,
        webLink: `https://github.com/${githubPerson.login}`,
      },
      githubPerson.id,
    )
  }

  /**
   * Creates a single app person from a commit.
   */
  private createPersonBitFromCommit(commit: GithubCommit): Bit {
    return BitUtils.create(
      {
        appType: 'github',
        appId: this.app.id,
        type: 'person',
        originalId: commit.email,
        title: commit.name,
        email: commit.email,
        photo: commit.avatarUrl,
      },
      commit.email,
    )
  }
}
