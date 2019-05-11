import { getGlobalConfig } from '@o/config'
import { nestSchema } from '@o/graphql-nest-schema'
import { AppDefinition } from '@o/kit'
import { Logger } from '@o/logger'
import { AppBit, AppEntity, Space, SpaceEntity } from '@o/models'
import bodyParser from 'body-parser'
import express from 'express'
import { readJSON } from 'fs-extra'
import { GraphQLSchema } from 'graphql'
import { graphqlExpress } from 'graphql-server-express'
import { makeExecutableSchema, makeRemoteExecutableSchema, mergeSchemas } from 'graphql-tools'
import killPort from 'kill-port'
import { join } from 'path'
import { getRepository } from 'typeorm'

async function getWorkspaceAppPaths(workspace: string) {
  const workspaceRoot = join(require.resolve(workspace), '..')
  const packageJSON = join(workspaceRoot, 'package.json')
  const packages = (await readJSON(packageJSON)).dependencies
  return Object.keys(packages).map(pkgName => {
    let cur = workspaceRoot
    let path
    while (!path && path !== '/') {
      try {
        path = require.resolve(join(cur, 'node_modules', pkgName))
        // found "compiled out" path so lets make sure we go up to name
        const baseName = pkgName.replace(/@[a-zA-Z0-9_\-\.]+\//, '') // remove any namespace
        const packageRootIndex = path.split('/').findIndex(x => x === baseName) // find root index
        const packageRoot = path
          .split('/')
          .slice(0, packageRootIndex + 1)
          .join('/')
        path = packageRoot
      } catch {
        cur = join(cur, '..')
      }
    }
    return path
  })
}

async function getWorkspaceAppDefinitions(workspace: string): Promise<AppDefinition[]> {
  const paths = await getWorkspaceAppPaths(workspace)
  return paths.map(name => {
    return require(name).default
  })
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

    log.info('start()')

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

        console.log('spaces', spaces)

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

        const appDefs = await getWorkspaceAppDefinitions('@o/example-workspace')

        for (const app of apps) {
          const appDef = appDefs.find(def => def.id === app.identifier)

          if (app && !appDef) {
            console.log(`
              ${app.identifier}:
              WARNING! found an app-bit but no app-def, meaning your DB is out of sync with your
              workspace package.json deps. this is an orbit issue.
            `)
          } else {
            console.log(`
              loading ${app.identifier}, graph? ${!!appDef.graph}
            `)
          }

          if (!appDef) continue
          if (!appDef.graph) continue

          try {
            const appSchema = await appDef.graph(app)

            console.log('appSchema', appSchema)

            let schema: GraphQLSchema

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
