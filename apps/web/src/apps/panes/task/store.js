import App, { Thing } from '~/app'

const getIssue = async (taskId, issueNumber) => {
  const thing = await Thing.findOne(taskId).exec()

  return await GithubStore.api
    .repos(thing.orgName, thing.parentId)
    .issues(issueNumber)
}

class GithubStore {
  static get api() {
    return App.services.Github.github
  }

  static editTask = newTitle => {}

  static deleteTask = num => {}

  static createTask = title => {}

  static setLabels = async (taskId, issueNumber, labels) => {
    const thing = await Thing.findOne(taskId).exec()
    const issue = await getIssue(taskId, issueNumber)
    const res = issue.labels.add(labels)

    if (res !== true) return

    thing.data = {
      ...thing.data,
      labels,
    }

    await thing.save()
  }

  static deleteLabel = (taskId, issueNumber, label) => {}

  static setAssigned = assigned => {}

  static deleteComment = async (taskId, issueNumber, commentId) => {
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

  static editComment = async (issueId, body) => {
    const thing = await Thing.findOne(issueId).exec()

    thing.data = {
      ...thing.data,
      comments: thing.data.comments.map((c, body) => {
        if (c.body !== body) return c
        return { ...c, body }
      }),
    }

    await thing.save()
  }

  static createComment = async (taskId, issueNumber, body) => {
    const thing = await Thing.findOne(taskId).exec()
    const issue = await getIssue(taskId, issueNumber)
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
    GithubStore.setLabels(this.taskId, this.taskNumber, labels)
    this.labels = labels
  }

  setAssigned = xs => {
    this.assigned = xs
  }

  async start() {
    const { data: { data } } = this.props.paneStore

    this.props.getRef(this)

    this.labels = data.labels.map(({ name }) => name)

    const thing = await Thing.findOne(this.taskId).exec()
    this.allIssues = await GithubStore.api
      .repos(thing.orgName, thing.parentId)
      .issues.fetch()
    console.log('all issues are ', this.allIssues)
  }

  // todo, change to body
  deleteComment = async id => {
    GithubStore.deleteComment(this.taskId, this.taskNumber, id)
  }

  get taskNumber() {
    return 55
  }

  get taskId() {
    return this.props.paneStore.data.id
  }

  onSubmit = body => {
    GithubStore.createComment(this.taskId, this.taskNumber, body)
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
    }))

    const firstComment = {
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
      },
      firstComment,
      ...comments,
      {
        elName: 'response',
        data: {
          onSubmit: this.onSubmit,
        },
      },
    ]
  }
}
