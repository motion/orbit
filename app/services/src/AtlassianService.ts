import * as r2 from '@mcro/r2'
// https://tryorbit2.atlassian.net

type AtlassianOptions = {
  start?: number
  limit?: number
  expand?: string
}

export class AtlassianService {
  setting = null

  constructor(setting) {
    this.setting = setting
  }

  // auto get all pages
  fetchAll = async (
    path,
    query: AtlassianOptions = {},
    options?: RequestInit,
  ) => {
    let results = []
    let finished = false
    let start = query.start || 0
    while (!finished) {
      const cur = await this.fetch(path, { ...query, start }, options)
      if (!cur.results) {
        console.log('error', cur)
        throw new Error('No results')
      }
      results = [...results, ...cur.results]
      // got all
      if (cur.results.length <= cur.limit) {
        finished = true
        continue
      }
      // get more
      start = start += cur.results.length
    }
    return results
  }

  // get single resource
  fetch = async (path: string, query?: Object, options?: RequestInit) => {
    if (!this.setting || !this.setting.values.atlassian) {
      throw new Error('No atlassian setting')
    }
    const { username, password, domain } = this.setting.values.atlassian
    if (!username || !password || !domain) {
      throw new Error('No username/password/domain')
    }
    const doFetch = () =>
      r2.get(`${domain}${path}`, {
        query,
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${username}:${password}`,
          ).toString('base64')}`,
        },
        ...options,
      })
    try {
      return await doFetch().json
    } catch (err) {
      console.log('atlassian fetch err', err)
      return { error: true, response: await doFetch().text }
    }
  }
}
