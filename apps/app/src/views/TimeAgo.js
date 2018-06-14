import { Component } from 'react'
import differenceInSeconds from 'date-fns/difference_in_seconds'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

export class TimeAgo extends Component {
  static defaultProps = {
    element: 'p',
    postfix: '',
    className: undefined,
    isLive: true,
    addSuffix: true,
    includeSeconds: true,
    timeInterval: 60 * 1000,
  }

  interval = 0

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
      const options = {
        addSuffix: this.props.addSuffix,
        includeSeconds: this.props.includeSeconds,
      }
      return distanceInWordsToNow(this.date, options)
        .replace('about ', '')
        .replace('less than ', '')
        .replace(' ago', this.props.postfix ? ` ${this.props.postfix}` : '')
    }
  }

  render() {
    return this.getParsedDate()
  }
}
