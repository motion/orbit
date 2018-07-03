import { createApolloFetch } from '~/node_modules/apollo-fetch'
import { GitHubIssueFetchResult } from './github-query'

export const fetchFromGitHub = async (token: string, query: string, variables: object): Promise<GitHubIssueFetchResult> => {
  const results = createApolloFetch({
    uri: 'https://api.github.com/graphql',
  }).use(({ options }, next) => {
    if (!options.headers) {
      options.headers = {}
    }
    options.headers['Authorization'] = `bearer ${token}`
    next()
  })({ query, variables })
  // @ts-ignore
  if (results.message) {
    console.error('Error doing fetch', results)
    return null
  }
  return results as any
}