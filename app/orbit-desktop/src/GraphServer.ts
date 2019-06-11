import { getWorkspaceAppPaths } from '@o/cli'
import { getGlobalConfig } from '@o/config'
import { nestSchema } from '@o/graphql-nest-schema'
import { Logger } from '@o/logger'
import { AppBit, AppDefinition, AppEntity, Space, SpaceEntity } from '@o/models'
import { partition } from '@o/utils'
import { createHttpLink } from 'apollo-link-http'
import bodyParser from 'body-parser'
import express from 'express'
import { pathExistsSync } from 'fs-extra'
import { GraphQLSchema } from 'graphql'
import { graphqlExpress } from 'graphql-server-express'
import {
  introspectSchema,
  makeExecutableSchema,
  makeRemoteExecutableSchema,
  mergeSchemas,
} from 'graphql-tools'
import killPort from 'kill-port'
import { join } from 'path'
import { getRepository } from 'typeorm'

const entryFileNames = {
  node: 'index.node.js',
  web: 'index.js',
  appInfo: 'appInfo.js',
}

async function getWorkspaceAppDefinitions(
  workspace: string,
  type: 'node' | 'web' | 'appInfo',
): Promise<
  ({ type: 'success'; definition: AppDefinition } | { type: 'error'; message: string })[]
> {
  const paths = await getWorkspaceAppPaths(workspace)
  return paths
    .map(name => {
      try {
        const path = join(require.resolve(name.directory), '..', entryFileNames[type])
        if (!pathExistsSync(path)) {
          return null
        }
        return {
          type: 'success' as const,
          definition: require(path).default,
        }
      } catch (err) {
        return {
          type: 'error' as const,
          message: `Error importing app, has it been built? ${err.message}\n${err.stack}`,
        }
      }
    })
    .filter(x => !!x)
}

const log = new Logger('graphServer')
const Config = getGlobalConfig()
const port = Config.ports.graphServer

export class GraphServer {
  server: express.Application
  graphMiddleware = {}

  constructor() {
    this.server = express()
    this.server.set('port', port)
    this.server.use(require('cors')())
    this.server.disable('etag')
    this.server.use(bodyParser.json({ limit: '2048mb' }))
    this.server.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }))
    this.server.get('/hello', (_, res) => res.send('hello world'))
  }

  start() {
    this.watchWorkspacesForGraphs()

    // graphql
    this.server.use('/graphql/:workspaceId', bodyParser.json(), (req, res, next) => {
      const middleware = this.graphMiddleware[req.params.workspaceId]
      console.log('got req', !!middleware, req.params.workspaceId)

      if (middleware) {
        return middleware(req, res, next)
      } else {
        res.json({
          bad: 'is-bad-yea',
        })
      }
    })

    return new Promise(async res => {
      log.verbose(`Killing old server on ${port}...`)
      await killPort(port)

      this.server.listen(port, () => {
        res()
        log.info('Server listening', port)
      })
    })
  }

  private watchWorkspacesForGraphs() {
    let subs: ZenObservable.Subscription[] = []

    getRepository(SpaceEntity)
      .observe()
      .subscribe(async _ => {
        for (const sub of subs) {
          sub.unsubscribe()
        }

        let spaces: Space[] = _ as any

        for (const space of spaces) {
          subs.push(this.watchAppsForSchemaSetup(space.id))
        }
      })
  }

  private watchAppsForSchemaSetup(spaceId: number) {
    return getRepository(AppEntity)
      .observe({
        where: {
          spaceId,
        },
      })
      .subscribe(async _ => {
        const apps: AppBit[] = _ as any

        let schemas = []

        const allWorkspaceDefs = await getWorkspaceAppDefinitions('@o/example-workspace', 'node')
        const [errors, nonErrors] = partition(allWorkspaceDefs, x => x.type === 'error')
        const appDefs = nonErrors
          .filter(x => x.type === 'success')
          .map(x => x.type === 'success' && x.definition)

        if (errors.length) {
          // TODO should have a build process here where we automatically build un-built things, but requires work
          log.error(
            `errors in app definitions ${errors
              .map(x => x.type === 'error' && x.message)
              .join('\n')}`,
          )
        }

        for (const app of apps) {
          const appDef = appDefs.find(def => def.id === app.identifier)

          if (app && !appDef) {
            log.verbose(
              `GraphServer, ${
                app.identifier
              }: WARNING! found an app-bit but no app-def, DB maybe out of sync.`,
            )
          } else {
            // console.log(`
            //   loading ${app.identifier}, graph? ${!!appDef.graph}
            // `)
          }

          if (!appDef) continue
          if (!appDef.graph) continue

          try {
            const appSchema = await appDef.graph(app)

            let schema: GraphQLSchema

            if (appSchema.remoteHttpLink) {
              const link = createHttpLink(appSchema.remoteHttpLink)
              const introspectionSchema = await introspectSchema(link)
              schema = makeRemoteExecutableSchema({
                schema: introspectionSchema,
                link,
              })
            } else {
              if (typeof appSchema.schema === 'string') {
                schema = makeExecutableSchema({
                  typeDefs: appSchema.schema,
                  resolvers: appSchema.resolvers,
                })
              } else {
                schema = appSchema.schema || appSchema
              }
              if (appSchema.link) {
                schema = makeRemoteExecutableSchema({
                  schema,
                  link: appSchema.link,
                })
              }
            }

            const whiteSpaceRegex = /[\s]+/g
            const typeName = app.name
              .split(whiteSpaceRegex)
              .map(x => x.replace(/[^a-zA-Z]/g, ''))
              .join('_')
            const fieldName = app.identifier.replace('-', '_')

            schema = await nestSchema({
              typeName,
              fieldName,
              schema,
            })

            schemas.push(schema)
          } catch (err) {
            console.error(`\n\n Error loading graph ${err}`)
          }
        }

        this.graphMiddleware[spaceId] = graphqlExpress({
          schema: mergeSchemas({ schemas }),
        })
      })
  }
}
