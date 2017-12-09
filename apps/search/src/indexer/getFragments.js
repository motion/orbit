import { startsWith } from 'lodash'

const titleMarker = '#'
const subtitleMarker = '##'
/*
  given an item of content,
  it returns an array of links, which are individual pieces of content 
  within a larger structure, such as pages in a doc
*/
export default content => {
  // modify our temporary dropbox corpus
  if (content.indexOf(':title:') > -1) {
    content = content.replace(/\:title\:/g, '#')
    content = content.replace(/\:subtitle\:/g, '##')
  }
  const createLink = (title, subtitle, lines) => ({
    body: lines.join('\n'),
    title,
    subtitle,
  })

  const reduced = content.split('\n').reduce(
    (status, line) => {
      line = line.trim()
      // commit to links
      if (startsWith(line, subtitleMarker)) {
        return {
          ...status,
          subtitle: line.split(subtitleMarker)[1].trim(),
          links: [
            ...status.links,
            createLink(status.title, status.subtitle, status.currentLines),
          ],
          currentLines: [],
        }
      }

      // ignore
      if (startsWith(line, titleMarker)) {
        return { ...status, title: line.split(titleMarker)[1].trim() }
      }

      // add lines to currentLines
      return { ...status, currentLines: [...status.currentLines, line] }
    },
    { title: '', subtitle: '', currentLines: [], links: [] }
  )

  // add last built up link to current list
  const links = [
    ...reduced.links,
    createLink(reduced.title, reduced.subtitle, reduced.currentLines),
  ]

  return links
}
