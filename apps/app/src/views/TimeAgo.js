import React, { Component } from 'react'
import differenceInSeconds from 'date-fns/difference_in_seconds'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

export class TimeAgo extends Component {
  static defaultProps = {
    element: 'p',
    date: new Date(),
    className: undefined,
    isLive: true,
    addSuffix: true,
    includeSeconds: true,
  }

  componentDidMount() {
    if (this.props.isLive) {
      this.updateTime()
    }
  }

  componentWillUnmount() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval)
    }
  }

  updateTime = () => {
    const interval = this.getInterval()
    if (interval > 0) {
      setTimeout(this.updateTime, interval)
      this.forceUpdate()
    }
  }

  getDifference() {
    return differenceInSeconds(new Date(), this.props.date)
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
      return distanceInWordsToNow(this.props.date, options)
    }
  }

  render() {
    return React.createElement(
      this.props.element,
      { className: this.props.className ? this.props.className : '' },
      this.getParsedDate(),
    )
  }
}
