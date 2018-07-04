// https://tryorbit2.atlassian.net/wiki/rest/api/content

export default setting => ({
  async fetch(path: string, options: RequestInit = {}) {
    const { username, password, domain } = setting.values
    if (!username || !password || !domain) {
      throw new Error('No username/password/domain')
    }
    const headers = new Headers({
      Authorization: 'Basic ' + btoa(username + ':' + password),
    })
    const res = await fetch(`${domain}${path}`, {
      headers: headers,
      ...options,
    })
    return await res.json()
  },
})
