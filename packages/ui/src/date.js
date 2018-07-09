import timeago from 'time-ago'

const { ago } = timeago()

export const format = text => {
  if (!text) {
    return null
  }
  // @ts-ignore
  const date = new window.Date(text)
  const dateWords = ago(date)
  if (dateWords.indexOf('NaN') === 0) {
    console.log('got nan date', ago, text, date, dateWords)
    return 'nan'
  }
  return dateWords
}

export const Date = ({ children }) => format(children)
