import { AppBit } from '@o/kit'
import { createHttpLink } from 'apollo-link-http'
import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools'

export async function graph(app: AppBit) {
  const { token } = app
  const link = createHttpLink({
    uri: 'https://api.github.com/graphql',
    fetch,
    headers: {
      Authorization: `bearer ${token}`,
    },
  })
  const introspectionSchema = await introspectSchema(link)
  return makeRemoteExecutableSchema({
    schema: introspectionSchema,
    link,
  })
}
