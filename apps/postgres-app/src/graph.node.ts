import { AppBit } from '@o/kit'
import { ApolloLink, Observable } from 'apollo-link'
import graphileBuild from 'graphile-build'
import { graphql, print } from 'graphql'
import { Pool } from 'pg'
import { createPostGraphileSchema, PostGraphileOptions, withPostGraphileContext } from 'postgraphile'

import { PostgresAppData } from './PostgresModels'

export async function graph(app: AppBit<PostgresAppData>) {
  const c = app.data.credentials
  const pool = new Pool({
    user: c.username,
    host: c.hostname,
    database: c.database,
    password: c.password,
    port: +c.port,
  })
  const schema = await createSchema(pool, 'public', {})
  return {
    link: new PostGraphileLink({ pool, schema }),
    schema,
  }
}

async function createSchema(pool, schema: string | string[], options: PostGraphileOptions) {
  const schemas = Array.isArray(schema) ? schema : schema.split(',')
  return await createPostGraphileSchema(pool, schemas, {
    simpleCollections: 'both',
    dynamicJson: true,
    showErrorStack: true,
    extendedErrors: ['hint', 'detail', 'errcode'],
    legacyRelations: 'omit',
    ...options,
    skipPlugins: [
      graphileBuild.QueryPlugin,
      graphileBuild.MutationPlugin,
      graphileBuild.SubscriptionPlugin,
      ...(options.skipPlugins || []),
    ],
    prependPlugins: [RenamedQueryPlugin, ...(options.prependPlugins || [])],
  })
}

class PostGraphileLink extends ApolloLink {
  pool: any
  schema: any
  constructor({ pool, schema }) {
    super()
    this.pool = pool
    this.schema = schema
  }
  request(operation) {
    return new Observable(observer => {
      performQuery(
        this.pool,
        this.schema,
        operation.query,
        operation.variables,
        operation.operationName,
      )
        .then(data => {
          if (!observer.closed) {
            observer.next(data)
            observer.complete()
          }
        })
        .catch(error => {
          if (!observer.closed) {
            observer.error(error)
          }
        })
    })
  }
}

async function performQuery(pgPool, schema, query, variables, operationName) {
  const queryString = typeof query === 'string' ? query : print(query)
  return withPostGraphileContext({ pgPool }, async context =>
    graphql(schema, queryString, null, { ...context }, variables, operationName),
  )
}

function requireFrom(modules, moduleName) {
  const path = [...modules, moduleName].join('/node_modules/')
  try {
    return require(path)
  } catch (e) {
    // Doesn't exist.
    if (modules.length > 1) {
      const result = requireFrom(modules.slice(0, modules.length - 1), moduleName)
      if (result) return result
    }
    return (
      requireFrom(modules.slice(1), moduleName) ||
      requireFrom(modules.slice(0, modules.length - 1), moduleName)
    )
  }
}

function RenamedQueryPlugin(builder) {
  builder.hook('build', build =>
    build.extend(
      build,
      {
        $$isQuery: Symbol('isQuery'),
      },
      `Extending Build`,
    ),
  )
  builder.hook('GraphQLSchema', (schema, build) => {
    const {
      $$isQuery,
      newWithHooks,
      extend,
      graphql: { GraphQLObjectType },
    } = build
    const queryType = newWithHooks(
      GraphQLObjectType,
      {
        description: 'PostGraphile Query type, gives access to data from PostgreSQL',
        name: 'PostGraphileQuery',
        isTypeOf: (value, _context, info) => info.parentType == null || value === $$isQuery,
        fields: {},
      },
      {
        __origin: `gatsby-source-pg override`,
        isRootQuery: true,
      },
    )
    return extend(
      schema,
      {
        query: queryType,
      },
      `Adding 'query' type to Schema`,
    )
  })
}
