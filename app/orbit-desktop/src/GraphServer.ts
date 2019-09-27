import { requireWorkspaceDefinitions } from '@o/apps-manager'
import { getGlobalConfig } from '@o/config'
import { nestSchema } from '@o/graphql-nest-schema'
import { Logger } from '@o/logger'
import { AppBit } from '@o/models'
import { partition } from '@o/utils'
import { createHttpLink } from 'apollo-link-http'
import bodyParser from 'body-parser'
import express from 'express'
import { GraphQLSchema } from 'graphql'
import { graphqlExpress } from 'graphql-server-express'
import { introspectSchema, makeExecutableSchema, makeRemoteExecutableSchema, mergeSchemas } from 'graphql-tools'

import { getActiveSpace } from './helpers/getActiveSpace'

const log = new Logger('graphServer')

export class GraphServer {
  server: express.Application
  graphMiddleware = {}
  started = false

  start() {
    if (this.started) return
    this.started = true
    this.server = express()
    this.server.use(require('cors')())
    this.server.disable('etag')
    this.server.use(bodyParser.json({ limit: '2048mb' }))
    this.server.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }))
    this.server.get('/hello', (_, res) => res.send('hello world'))

    // graphql
    this.server.use('/graphql/:workspaceId', bodyParser.json(), (req, res, next) => {
      const workspaceId = req.params['workspaceId']
      const middleware = this.graphMiddleware[workspaceId]
      log.info('got req', !!middleware, workspaceId)

      try {
        if (middleware) {
          return middleware(req, res, next)
        } else {
          res.json({
            bad: 'is-bad-yea',
          })
        }
      } catch (err) {
        log.error(err.message, err.stack)
        res.json({
          error: `${err.message}`,
        })
      }
    })

    return new Promise(async res => {
      const Config = getGlobalConfig()
      const port = Config.ports.graphServer
      log.info(`Starting on ${port}`)
      this.server.listen(port, () => {
        log.info('Server listening', port)
        res()
      })
    })
  }

  async setupGraph(apps: AppBit[]) {
    const space = await getActiveSpace()
    let schemas = []

    const allWorkspaceDefs = await requireWorkspaceDefinitions(space.directory, 'node')
    const [errors, nonErrors] = partition(allWorkspaceDefs, x => x.type === 'error')
    const appDefs = nonErrors
      .filter(x => x.type === 'success')
      .map(x => x.type === 'success' && x.value)

    // TODO THIS IS BAD, its not an error its just that the app doesn't have a definition
    if (errors.length) {
      log.verbose(
        `errors in app definitions ${errors.map(x => x.type === 'error' && x.message).join('\n')}`,
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
        log.warning(`\n\n Error loading graph for ${app.id}: ${err.message}`, err.stack)
      }
    }

    this.graphMiddleware[space.id] = graphqlExpress({
      schema: mergeSchemas({ schemas }),
    })
  }
}
