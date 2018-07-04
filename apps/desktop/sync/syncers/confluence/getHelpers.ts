// https://tryorbit2.atlassian.net/wiki/rest/api/content

export default setting => ({
  async fetch(path: string, options: RequestInit = {}) {
    if (!setting || !setting.values.atlassian) {
      throw new Error('No atlassian setting')
    }
    const { username, password, domain } = setting.values.atlassian
    if (!username || !password || !domain) {
      throw new Error('No username/password/domain')
    }
    const headers = new Headers({
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString(
        'base64',
      )}`,
    })
    const doFetch = () =>
      fetch(`${domain}${path}`, {
        headers: headers,
        ...options,
      })
    const res = await doFetch()
    try {
      return await res.json()
    } catch (err) {
      console.log('err', err)
      const reFetch = await doFetch()
      return await reFetch.text()
    }
  },
})
