import { AppBit } from '@o/kit'
import graphQLSchema from '@o/swagger-to-graphql'

const proxyUrl = 'https://slack.com/api'
const pathToSwaggerSchema = './openapi.json'
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

// .then(schema => {
//   console.log(schema)
//   const app = express()

//   app.use(
//     '/graphql',
//     graphqlHTTP(() => {
//       return {
//         formatError: error => {
//           console.log(error)
//           return error
//         },
//         schema,
//         graphiql: true,
//       }
//     }),
//   )

//   app.listen(3009, 'localhost', () => {
//     console.info('http://localhost:3009/graphql')
//   })
// })
// .catch(e => {
//   console.log(e)
// })
