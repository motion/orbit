export async function fetchFromAtlassian<T = any>(
  atlassian: any,
  path: string,
): Promise<T> {
  if (!atlassian) {
    return null
  }
  const { username, password, domain } = atlassian
  const credentials = Buffer.from(`${username}:${password}`).toString('base64')

  const result = await fetch(`${domain}${path}`, {
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
  })
  if (!result.ok)
    throw new Error(
      `[${result.status}] ${result.statusText}: ${await result.text()}`,
    )

  return result.json()
}
