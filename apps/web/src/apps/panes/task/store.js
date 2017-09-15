class GithubStore {
  editTask = newTitle => {}

  deleteTask = num => {}

  createTask = title => {}

  setLabels = labels => {}

  setAssigned = assigned => {}

  deleteComment = num => {}

  editComment = num => {}

  createComment = body => {}
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

  setLabels = xs => {
    this.labels = xs
  }

  setAssigned = xs => {
    this.assigned = xs
  }

  ghAPI = () => App.services.Github.github

  async start() {
    const { data: { data } } = this.props.paneStore

    this.props.getRef(this)

    this.labels = data.labels.map(({ name }) => name)

    const thing = await this.getThing()
    this.allIssues = await this.ghAPI()
      .repos(thing.orgName, thing.parentId)
      .issues.fetch()
    console.log('all issues are ', this.allIssues)
  }

  titleToNumber = title => {
    return 183
    return this.allIssues.items.filter(i => i.title === title)[0].number
  }

  getThing = async id => {
    const { paneStore } = this.props
    return await Thing.findOne(paneStore.data.id).exec()
  }

  // todo, change to body
  removeComment = async body => {
    const thing = await this.getThing()
    thing.data = {
      ...thing.data,
      comments: thing.data.comments.filter(c => c.body !== body),
    }
    await thing.save()
  }

  getIssue = async () => {
    const thing = await this.getThing()
    return await this.ghAPI()
      .repos(thing.orgName, thing.parentId)
      .issues(this.titleToNumber(thing.data.title))
  }

  onSubmit = async body => {
    const issue = await this.getIssue()
    const thing = await this.getThing()
    const res = await issue.comments.create({ body })
    console.log('res is', res)
    const newComment = {
      body: res.body,
      createdAt: res.createdAt,
      author: {
        login: res.user.login,
        avatarUrl: res.user.avatarUrl,
      },
    }

    console.log('new comment is', newComment)

    thing.data = {
      ...thing.data,
      comments: [...thing.data.comments, newComment],
    }

    await thing.save()
  }

  get results() {
    const { data: { data } } = this.props.paneStore

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
