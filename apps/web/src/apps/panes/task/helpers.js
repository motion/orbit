import marked from 'marked'
import emojinize from 'emojinize'

export const format = str => {
  return marked(emojinize.encode(str))
}
