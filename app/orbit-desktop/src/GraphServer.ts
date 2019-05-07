import { getGlobalConfig } from '@o/config'
import { nestSchema } from '@o/graphql-nest-schema'
import { AppDefinition } from '@o/kit'
import { Logger } from '@o/logger'
import { AppBit, AppEntity, Space, SpaceEntity } from '@o/models'
import PostgresApp from '@o/postgres-app'
import SlackApp from '@o/slack-app'
import bodyParser from 'body-parser'
import express from 'express'
import { graphqlExpress } from 'graphql-server-express'
import { makeRemoteExecutableSchema, mergeSchemas } from 'graphql-tools'
import killPort from 'kill-port'
import { getRepository } from 'typeorm'

// TODO make generic
const allApps: { [key: string]: AppDefinition } = {
  slack: SlackApp,
  postgres: PostgresApp,
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

        for (const space of spaces) {
          subs.push(this.watchAppsForSchemaSetup(space.id))
        }
      })
  }

  private watchAppsForSchemaSetup(spaceId: number) {
    return getRepository(AppEntity)
      .observe({
        spaceId,
      })
      .subscribe(async _ => {
        let apps: AppBit[] = _ as any
        let schemas = []

        for (const app of apps) {
          const appDef = allApps[app.identifier]
          if (!appDef) continue
          if (!appDef.graph) continue
          // TODO hardcoding this, should be generic
          if (!(app.token || app.data['credentials'])) {
            continue
          }

          const appSchema = await allApps[app.identifier].graph(app)

          let schema = appSchema.schema || appSchema

          if (appSchema.link) {
            schema = makeRemoteExecutableSchema({
              schema,
              link: appSchema.link,
            })
          }

          const whiteSpaceRegex = /[\s]+/g

          schema = await nestSchema({
            typeName: app.name
              .split(whiteSpaceRegex)
              .map(x => x.replace(/[^a-zA-Z]/g, ''))
              .join('_'),
            fieldName: app.identifier.replace('-', '_'),
            schema,
          })

          schemas.push(schema)
        }

        this.graphMiddleware[spaceId] = graphqlExpress({
          schema: mergeSchemas({ schemas }),
        })
      })
  }
}
