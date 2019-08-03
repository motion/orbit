import { AppBit } from '@o/kit'
import graphQLSchema from '@o/swagger-to-graphql'
import { join } from 'path'

const proxyUrl = 'https://slack.com/api'
const pathToSwaggerSchema = join(__dirname, '..', 'openapi.json')

export async function graph(app: AppBit) {
  return await graphQLSchema(
    pathToSwaggerSchema,
    proxyUrl,
    {
      Authorization: `Bearer ${app.token}`,
    },
    { gzip: true },
  )
}
