import { ApolloServer } from 'apollo-server'
import { getRepository } from 'typeorm'
import { AppEntity } from '@o/models'
import SlackApp from '@o/slack-app'

export class GraphServer {
  server: ApolloServer

  async start() {
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

    this.server = new ApolloServer({
      schema: await SlackApp.graph(app),
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
