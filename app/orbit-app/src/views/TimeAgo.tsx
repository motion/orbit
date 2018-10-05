import { Component } from 'react'
import { differenceInSeconds, formatRelative } from 'date-fns'

type TimeAgoProps = {
  date?: number | Date
  children?: number | Date
  postfix?: string
  isLive?: boolean
  timeInterval?: number
}

export class TimeAgo extends Component<TimeAgoProps> {
  static defaultProps = {
    date: null,
    element: 'p',
    postfix: '',
    className: undefined,
    isLive: true,
    addSuffix: true,
    includeSeconds: true,
    timeInterval: 60 * 1000,
  }

  interval = null

  componentDidMount() {
    if (this.props.isLive) {
      this.interval = setInterval(this.updateTime, this.props.timeInterval)
      this.updateTime()
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  updateTime = () => {
    const interval = this.getInterval()
    if (interval > 0) {
      this.forceUpdate()
    }
  }

  get date() {
    return this.props.date || this.props.children
  }

  getDifference() {
    return differenceInSeconds(new Date(), this.date)
  }

  getInterval() {
    const diff = this.getDifference()
    if (diff < 3600) {
      return 60000
    } else if (diff >= 3600 && diff <= 86400) {
      return 3600000
    } else {
      return 0
    }
  }

  getParsedDate() {
    const diff = this.getDifference()
    if (diff < 30) {
      return 'now'
    } else {
      return (
        formatRelative(this.date, Date.now())
          .replace('about ', '')
          .replace('almost ', '')
          .replace('over ', '')
          .replace('less than ', '')
          .replace(' ago', this.props.postfix ? ` ${this.props.postfix}` : '')
          // this is always "last" in our case
          .replace('last ', '')
          .replace(' at ', ' ')
          .replace('today ', '')
          .replace(/\//g, '·')
          .replace(' PM', 'pm')
          .replace(' AM', 'am')
      )
    }
  }

  render() {
    return this.getParsedDate()
  }
}
