import { startsWith } from 'lodash'

const titleMarker = ':title:'
const subtitleMarker = ':subtitle:'
/*
  given an item of content,
  it returns an array of links, which are individual pieces of content 
  within a larger structure, such as pages in a doc
*/
export default content => {
  const createLink = (title, subtitle, lines) => ({
    body: lines.join('\n'),
    title,
    subtitle,
  })

  const reduced = content.split('\n').reduce(
    (status, line) => {
      line = line.trim()
      // ignore
      if (startsWith(line, titleMarker)) {
        return { ...status, title: line.split(titleMarker)[1].trim() }
      }

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
