import { ApolloServer } from 'apollo-server'
import { importSchema } from 'graphql-import'
import { parse } from 'graphql'
import { join } from 'path'
import { getRepository } from 'typeorm'
import { AppEntity } from '@o/models'

export class GraphServer {
  server: ApolloServer

  async start() {
    const base = join(require.resolve('@o/slack-app'), '..', '..')
    const conf = join(base, 'slack.graphql')

    const app = await getRepository(AppEntity).findOne({
      where: {
        identifier: 'slack',
        token: {
          $not: {
            $equal: '',
          },
        },
      },
    })

    console.log('app', app)

    this.server = new ApolloServer({
      typeDefs: parse(importSchema(conf)),
      context: ({ req }) => {
        console.log('req', req)
        return {
          slackToken: app.token,
        }
      },
    })

    await this.server.listen({
      port: 4000,
    })
  }
}

// import { GraphQLServer as YogaServer } from 'graphql-yoga'
// import { join } from 'path'
// import { getGraphQLConfig } from 'graphql-config'

// export class GraphServer {
//   server: YogaServer

//   async start() {
//     const base = join(require.resolve('@o/slack-app'), '..', '..')
//     const conf = join(base, 'slack.graphql')

//     const config = getGraphQLConfig(base)
//     const schema = config.getConfigForFile(conf).getSchema()

//     this.server = new YogaServer({
//       schema,
//     })

//     await this.server.start({
//       port: 4000,
//     })
//   }
// }
