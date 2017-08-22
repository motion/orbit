import client from 'github-graphql-client'

const nicksToken = 'b711959f85f7ac5b122fe9a571ac402d78454a0f'

const gqlRequest = gql =>
  new Promise(resolve => {
    client(
      {
        token: nicksToken,
        query: gql,
      },
      (err, res) => {
        if (err) console.log('github gql error', err)
        resolve(res)
      }
    )
  })

const getIssues = `
{
  organization(login: "atom") {
    id, repository(name: "atom") {
      name, issues(last:100, states: [OPEN]) {
        edges {
          node {
            title
            id
            bodyHTML
            createdAt
            number
            author {
              avatarUrl
              login
            }
            labels(first: 10) {
              edges {
                node {
                  name
                }
              }
            }
            comments(last: 100) {
              edges {
                node {
                  createdAt,
                  bodyHTML
                  id
                  author {
                    avatarUrl
                    login
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`

export default new class GithubHandler {
  async getIssues() {
    const res = await gqlRequest(getIssues)
    /*const issues = res.data.orgnization.repository.issues.edges.map(
      ({ node }) => {
        return node
      }
    )
    */

    return res
  }
}()
