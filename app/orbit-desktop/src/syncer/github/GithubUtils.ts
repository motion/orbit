import { createApolloFetch } from 'apollo-fetch'

export const fetchFromGitHub = async <T>(token: string, query: string, variables: object): Promise<T> => {
  // todo: replace with fetch here
  const results = createApolloFetch({
    uri: 'https://api.github.com/graphql',
  }).use(({ options }, next) => {
    if (!options.headers) {
      options.headers = {}
    }
    options.headers['Authorization'] = `bearer ${token}`
    next()
  })({ query, variables })
  if ((results as any).message) {
    throw new Error(results as any)
  }
  return results.then(results => {
    if (results.errors) {
      throw new Error(results as any)
    }

    return results.data
  })
}