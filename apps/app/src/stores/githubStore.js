import App, { Thing } from '~/app'

const getIssue = async taskId => {
  const thing = await Thing.findOne(taskId).exec()

  return GithubStore.api
    .repos(thing.orgName, thing.parentId)
    .issues(thing.data.number)
}

export default class GithubStore {
  static get api() {
    return App.services.Github.github
    /*
    return new Promise(async (resolve, reject) => {
      try {
        resolve(App.services.Github.github)
      } catch (err) {
        reject(err)
      }
    })
    */
  }

  static editTask = newTitle => {}

  static deleteTask = num => {}

  static createTask = title => {}

  static setLabels = async (taskId, labels) => {
    const thing = await Thing.findOne(taskId).exec()
    const issue = await getIssue(taskId)
    const res = issue.labels.add(labels)

    if (res !== true) return

    thing.data = {
      ...thing.data,
      labels,
    }

    await thing.save()
  }

  static setAssigned = assigned => {}

  static deleteComment = async (taskId, commentId) => {
    const thing = await Thing.findOne(taskId).exec()
    const res = await GithubStore.api
      .repos(thing.orgName, thing.parentId)
      .issues.comments(commentId)
      .remove()

    if (res !== true) return

    thing.data = {
      ...thing.data,
      comments: thing.data.comments.filter(c => c.id !== commentId),
    }

    await thing.save()
  }

  static editComment = async (issueId, id, body) => {
    const thing = await Thing.findOne(issueId).exec()

    thing.data = {
      ...thing.data,
      comments: thing.data.comments.map(comment => {
        if (comment.id !== id) return comment
        return { ...comment, body }
      }),
    }

    await thing.save()
  }

  static createComment = async (taskId, body) => {
    const thing = await Thing.findOne(taskId).exec()
    const issue = await getIssue(taskId)
    const res = await issue.comments.create({ body })
    const newComment = {
      id: res.id,
      body: res.body,
      createdAt: res.createdAt,
      author: {
        login: res.user.login,
        avatarUrl: res.user.avatarUrl,
      },
    }

    thing.data = {
      ...thing.data,
      comments: [...thing.data.comments, newComment],
    }

    await thing.save()
  }
}
