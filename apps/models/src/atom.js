import { flatten } from 'lodash'

const cardUrl = `http://api.jot.dev/trello/cards`
const issuesUrl = `http://api.jot.dev/github/issues`

class Atom {
  async getCards() {
    const vals = await (await fetch(cardUrl)).json()
    return vals.map(val => ({ service: 'trello', ...val }))
  }

  async getIssues() {
    const val = await (await fetch(issuesUrl)).json()
    const org = val.data.organization
    const repo = org.repository

    const issues = repo.issues.edges.map(({ node }) => {
      // for now the issue content is just considered a comment
      const baseComment = {
        date: +new Date(node.createdAt),
        content: node.bodyHTML,
        author: node.author.login,
        avatarUrl: node.author.avatarUrl,
      }

      const comments = node.comments.edges.map(({ node }) => ({
        id: node.id,
        author: node.author.login,
        avatarUrl: node.author.avatarUrl,
        date: +new Date(node.createdAt),
        content: node.bodyHTML,
      }))

      return {
        service: 'github',
        searchWords: 'github issues',
        card: {
          name: node.title,
          id: node.number + '',
          date: baseComment.date,
          labels: node.labels.edges.map(({ node }) => node.name).join(' '),
        },
        comments: [baseComment, ...comments],
      }
    })

    return issues
  }

  async getAll() {
    return flatten(await Promise.all([this.getIssues(), this.getCards()]))
  }

  async onsubmit() {}
}

export default new Atom()
