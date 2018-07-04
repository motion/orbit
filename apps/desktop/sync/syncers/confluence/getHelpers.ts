import * as r2 from '@mcro/r2'
// https://tryorbit2.atlassian.net/wiki/rest/api/content

type AtlassianOptions = {
  start?: number
  limit?: number
  expand?: string
}

export default setting => ({
  // auto get all pages
  async fetchAll(path, query: AtlassianOptions = {}, options?: RequestInit) {
    let results = []
    let finished = false
    let start = query.start || 0
    while (!finished) {
      const cur = await this.fetch(path, { start }, options)
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
  },
  // get single resource
  async fetch(path: string, query?: Object, options?: RequestInit) {
    if (!setting || !setting.values.atlassian) {
      throw new Error('No atlassian setting')
    }
    const { username, password, domain } = setting.values.atlassian
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
      console.log('err', err)
      return await doFetch().text
    }
  },
})
