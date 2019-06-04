import { createWorker } from '@o/worker-kit'

import { GithubBitFactory } from './GithubBitFactory'
import { GithubLoader } from './GithubLoader'
import { GithubAppData, GithubAppValuesLastSyncRepositoryInfo, GithubIssue, GithubPullRequest } from './GithubModels'

/**
 * Syncs Github.
 *
 * One important note regarding to github bits syncing - issues and PRs in github never be removed,
 * which means we never remove github bits during regular sync.
 * We only remove when some app change (for example user don't sync specific repository anymore).
 */
export const GithubSyncer = createWorker(async ({ app, log, utils }) => {
  const data: GithubAppData = app.data
  const loader = new GithubLoader(app, log)
  const factory = new GithubBitFactory(utils)

  /**
   * Handles a single issue or pull request from loaded issues/PRs stream.
   */
  const handleIssueOrPullRequest = async (options?: {
    type: 'issue' | 'pull-request'
    issueOrPullRequest: GithubIssue | GithubPullRequest
    organization: string
    repositoryName: string
    cursor: string
    loadedCount: number
    lastIssue: boolean
    lastSyncInfo: GithubAppValuesLastSyncRepositoryInfo
  }) => {
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
      log.info('reached last synced date, stop syncing...', {
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
      await utils.updateAppData()

      return false // this tells from the callback to stop issue proceeding
    }

    // for the first ever synced issue we store its updated date, and once sync is done,
    // next time we make sync again we don't want to sync issues less then this date
    if (!lastSyncInfo.lastCursorSyncedDate) {
      lastSyncInfo.lastCursorSyncedDate = updatedAt
      log.info('looks like its the first syncing issue, set last synced date', lastSyncInfo)
      await utils.updateAppData()
    }

    const comments =
      issueOrPullRequest.comments.totalCount > 0
        ? await loader.loadComments(organization, repositoryName, issueOrPullRequest.number)
        : []

    // load issue bit from the database
    const bit = factory.createTaskBit(issueOrPullRequest, comments)
    if (type === 'issue') {
      bit.people = factory.createPersonBitFromIssue(issueOrPullRequest)
    } else {
      // pull request
      bit.people = factory.createPersonBitFromPullRequest(issueOrPullRequest as GithubPullRequest)
    }

    await utils.saveBits(bit.people)
    await utils.saveBit(bit)

    // in the case if its the last issue we need to cleanup last cursor stuff and save last synced date
    if (lastIssue) {
      log.info(
        'looks like its the last issue in this sync, removing last cursor and app last sync date',
        lastSyncInfo,
      )
      lastSyncInfo.lastSyncedDate = lastSyncInfo.lastCursorSyncedDate
      lastSyncInfo.lastCursor = undefined
      lastSyncInfo.lastCursorSyncedDate = undefined
      lastSyncInfo.lastCursorLoadedCount = undefined
      await utils.updateAppData()
      return true
    }

    // update last sync settings to make sure we continue from the last point in the case if application will stop
    if (lastSyncInfo.lastCursor !== cursor) {
      log.verbose('updating last cursor in settings', { cursor })
      lastSyncInfo.lastCursor = cursor
      lastSyncInfo.lastCursorLoadedCount = loadedCount
      await utils.updateAppData()
    }

    return true
  }

  // load repositories from the API first
  let repositories = await loader.loadUserRepositories()

  // get whitelist, if its not defined just return all loaded repositories
  const values = data.values
  if (values.whitelist !== undefined) {
    log.info('whitelist is defined, filtering settings by a whitelist', values.whitelist)
    repositories = repositories.filter(repository => {
      return values.whitelist.indexOf(repository.nameWithOwner) !== -1
    })
    log.info('filtered repositories by whitelist', repositories)
  }

  // if it was defined return filtered repositories
  if (values.externalRepositories && values.externalRepositories.length > 0) {
    log.info('externalRepositories were found', values.externalRepositories)
    repositories.push(...(await loader.loadRepositories(values.externalRepositories)))
  }

  if (!repositories.length) {
    log.info('no repositories were selected in the settings, skip sync')
    return
  }

  // initial default settings
  if (!data.values.lastSyncIssues) data.values.lastSyncIssues = {}
  if (!data.values.lastSyncPullRequests) data.values.lastSyncPullRequests = {}

  // go through all repositories and sync them all
  log.timer('load api bits and people')
  for (let repository of repositories) {
    await utils.isAborted()

    if (!data.values.lastSyncIssues[repository.nameWithOwner])
      data.values.lastSyncIssues[repository.nameWithOwner] = {}
    if (!data.values.lastSyncPullRequests[repository.nameWithOwner])
      data.values.lastSyncPullRequests[repository.nameWithOwner] = {}

    const lastSyncIssues = data.values.lastSyncIssues[repository.nameWithOwner]
    const lastSyncPullRequests = data.values.lastSyncPullRequests[repository.nameWithOwner]
    const [organization, repositoryName] = repository.nameWithOwner.split('/')

    // compare repository's first issue updated date with our last synced date to make sure
    // something has changed since our last sync. If nothing was changed we skip issues sync
    if (
      lastSyncIssues.lastSyncedDate &&
      repository.issues.nodes.length &&
      new Date(repository.issues.nodes[0].updatedAt).getTime() === lastSyncIssues.lastSyncedDate
    ) {
      log.verbose(
        `looks like nothing was changed in a ${
          repository.nameWithOwner
        } repository issues from our last sync, skipping`,
      )
    } else {
      // load repository issues and sync them in a stream
      await loader.loadIssues({
        organization,
        repository: repositoryName,
        cursor: lastSyncIssues.lastCursor,
        loadedCount: lastSyncIssues.lastCursorLoadedCount || 0,
        handler: (issue, cursor, loadedCount, isLast) => {
          return handleIssueOrPullRequest({
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
    }

    // compare repository's first PR updated date with our last synced date to make sure
    // something has changed since our last sync. If nothing was changed we skip PRs sync
    if (
      lastSyncPullRequests.lastSyncedDate &&
      repository.pullRequests.nodes.length &&
      new Date(repository.pullRequests.nodes[0].updatedAt).getTime() ===
        lastSyncPullRequests.lastSyncedDate
    ) {
      log.verbose(
        `looks like nothing was changed in a ${
          repository.nameWithOwner
        } repository PRs from our last sync, skipping`,
      )
    } else {
      // load repository pull requests and sync them in a stream
      await loader.loadPullRequests({
        organization,
        repository: repositoryName,
        cursor: lastSyncPullRequests.lastCursor,
        loadedCount: lastSyncPullRequests.lastCursorLoadedCount || 0,
        handler: (issue, cursor, loadedCount, isLast) => {
          return handleIssueOrPullRequest({
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
    }
  }
  log.timer('load api bits and people')
})
