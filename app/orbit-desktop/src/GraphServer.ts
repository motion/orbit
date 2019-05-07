import { getGlobalConfig } from '@o/config'
import { nestSchema } from '@o/graphql-nest-schema'
import { AppDefinition } from '@o/kit'
import { Logger } from '@o/logger'
import { AppBit, AppEntity } from '@o/models'
import PostgresApp from '@o/postgres-app'
import SlackApp from '@o/slack-app'
import bodyParser from 'body-parser'
import express from 'express'
import { graphqlExpress } from 'graphql-server-express'
import { mergeSchemas } from 'graphql-tools'
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
  graphMiddleware: any

  constructor() {
    this.server = express()
    this.server.set('port', port)
    this.server.disable('etag')
    this.server.use(bodyParser.json({ limit: '2048mb' }))
    this.server.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }))
    this.server.get('/hello', (_, res) => res.send('hello world'))
  }

  start() {
    this.getAppSchemas()

    log.info('start()')

    // graphql
    this.server.use('/graphql', bodyParser.json(), (req, res, next) => {
      if (this.graphMiddleware) {
        this.graphMiddleware(req, res, next)
      } else {
        res.json({
          bad: 'is-bad-yea',
        })
      }
    })

    return new Promise(async res => {
      log.verbose(`Killing old server on ${Config.ports.server}...`)
      await killPort(port)

      this.server.listen(port, () => {
        res()
        log.info('Server listening', Config.ports.server)
      })
    })
  }

  private async setupGraph(schemas: any) {
    this.graphMiddleware = graphqlExpress({
      schema: mergeSchemas({ schemas }),
    })
  }

  private async getAppSchemas() {
    await getRepository(AppEntity)
      .observe()
      .subscribe(async _ => {
        let apps: AppBit[] = _ as any
        let schemas = []

        for (const app of apps) {
          const appDef = allApps[app.identifier]
          if (!appDef) {
            continue
          }
          if (!appDef.graph) {
            continue
          }
          // TODO hardcoding this, should be generic
          if (!(app.token || app.data['credentials'])) {
            continue
          }

          const appSchema = await allApps[app.identifier].graph(app)

          const schema = await nestSchema({
            typeName: app.name,
            fieldName: app.identifier,
            schema: appSchema,
          })

          schema.push(schema)
        }

        this.setupGraph(schemas)
      })
  }
}
