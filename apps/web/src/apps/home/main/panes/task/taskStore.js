// @flow
import { watch } from '@mcro/black'
import { Thing } from '~/app'
import GithubStore from '~/stores/githubStore'

type TaskProps = {
  paneStore: {
    activeIndex: number,
    data: {
      id: number,
      labels: ?Array<string>,
    },
  },
}

export default class TaskStore {
  props: TaskProps
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

  @watch thing = () => Thing.findOne(this.taskId)
  @watch
  allIssues = () =>
    this.thing &&
    GithubStore.api
      .repos(this.thing.orgName, this.thing.parentId)
      .issues.fetch()

  async willMount() {
    const { data } = this.props.paneStore
    if (data.labels) {
      this.labels = data.labels.map(({ name }) => name)
    }
  }

  get result() {
    return this.props.stackItem.selectedResult
  }

  get data() {
    return this.result.data
  }

  get results() {
    const data = this.data
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
    return [firstComment, ...comments]
  }

  get taskId() {
    return this.props.paneStore.data.id
  }

  setLabels = labels => {
    GithubStore.setLabels(this.taskId, labels)
    this.labels = labels
  }

  setAssigned = xs => {
    this.assigned = xs
  }

  // todo, change to body
  deleteComment = async id => {
    GithubStore.deleteComment(this.taskId, id)
  }

  onSubmit = body => {
    GithubStore.createComment(this.taskId, body)
  }
}
