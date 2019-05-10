import { AppBit } from '@o/kit'
import { createHttpLink } from 'apollo-link-http'
import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools'

export async function graph(app: AppBit) {
  const { url, headers = {}, fetchOptions = {} } = app.data.credentials

  const link = createHttpLink({
    uri: url,
    fetch,
    headers,
    fetchOptions,
  })

  const introspectionSchema = await introspectSchema(link)

  return makeRemoteExecutableSchema({
    schema: introspectionSchema,
    link,
  })
}
