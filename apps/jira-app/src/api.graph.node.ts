import { AppBit } from '@o/kit'
import graphQLSchema from '@o/swagger-to-graphql'
import { join } from 'path'

import { JiraAppData } from './JiraModels'

const pathToSwaggerSchema = join(__dirname, '..', 'swagger-v3.v3.json')

export async function graph(app: AppBit<JiraAppData>) {
  const proxyUrl = `${app.data.setup.domain}/rest/api/3`
  return await graphQLSchema(
    pathToSwaggerSchema,
    proxyUrl,
    {
      Authorization: `Bearer ${app.token}`,
    },
    { gzip: true },
  )
}
