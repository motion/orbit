import { AppBit } from '@o/kit'
import { createHttpLink } from 'apollo-link-http'
import { introspectSchema } from 'graphql-tools'

export async function graph(app: AppBit) {
  return sourceNodes(app.data.setup)
}

export async function sourceNodes({ createLink, createSchema, ...options }) {
  const link = createLink
    ? createLink(options)
    : createHttpLink({
        uri: options.url,
        fetch,
        headers: options.headers || {},
        fetchOptions: options.fetchOptions || {},
      })

  let schema
  if (createSchema) {
    schema = await createSchema(options)
  } else {
    schema = await introspectSchema(link)
  }
  return {
    schema,
    link,
  }
}
