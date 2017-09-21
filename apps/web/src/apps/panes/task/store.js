import App, { Thing } from '~/app'

const getIssue = async taskId => {
  const thing = await Thing.findOne(taskId).exec()

  console.log('api is', GithubStore.api)
  return GithubStore.api
    .repos(thing.orgName, thing.parentId)
    .issues(thing.data.number)
}

class GithubStore {
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

export default class TaskStore {
  response = ''
  count = 0

  labels = []
  assigned = []
  allIssues = []

  assignOptions = [{ id: 'me' }, { id: 'nick' }, { id: 'steph' }]

  labelOptions = [
    { id: 'bug' },
    { id: 'duplicate' },
    { id: 'enhancement' },
    { id: 'help wanted' },
    { id: 'invalid' },
    { id: 'question' },
    { id: 'wontfix' },
  ]

  setLabels = labels => {
    GithubStore.setLabels(this.taskId, labels)
    this.labels = labels
  }

  setAssigned = xs => {
    this.assigned = xs
  }

  async willMount() {
    const { data: { data } } = this.props.paneStore

    this.labels = data.labels.map(({ name }) => name)

    const thing = await Thing.findOne(this.taskId).exec()
    this.allIssues = await GithubStore.api
      .repos(thing.orgName, thing.parentId)
      .issues.fetch()
  }

  // todo, change to body
  deleteComment = async id => {
    GithubStore.deleteComment(this.taskId, id)
  }

  get taskId() {
    return this.props.paneStore.data.id
  }

  onSubmit = body => {
    GithubStore.createComment(this.taskId, body)
  }

  get results() {
    const { data: { data } } = this.props.paneStore

    if (!data) {
      return []
    }

    const comments = (data.comments || []).map(comment => ({
      elName: 'comment',
      data: comment,
      actions: [],
      height: 100,
    }))

    const firstComment = {
      height: 100,
      elName: 'comment',
      data: {
        author: data.author,
        body: data.body,
        createdAt: data.createdAt,
        issueBody: true,
      },
    }

    return [
      {
        elName: 'header',
        data,
        actions: [],
        height: 50,
      },
      firstComment,
      ...comments,
      {
        height: 100,
        elName: 'response',
        data: {
          onSubmit: this.onSubmit,
        },
      },
    ]
  }
}
