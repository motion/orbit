import { startsWith } from 'lodash'

const titleMarkers = ['#', ':title:']
const subtitleMarkers = ['##', ':subtitle:', '**']
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
  const createFragment = (title, subtitle, lines) => ({
    body: lines.join('\n'),
    title,
    subtitle,
  })

  const afterMarker = s =>
    s
      .split(' ')
      .slice(1)
      .join(' ')
      .trim()
  const startsWithAny = (s, xs) => xs.filter(x => startsWith(s, x)).length > 0

  const reduced = content.split('\n').reduce(
    (status, line) => {
      line = line.trim()

      // if line is empty, do nothing
      if (line.length === 0) {
        return status
      }

      // commit to fragments if we have any lines so far
      if (startsWithAny(line, subtitleMarkers)) {
        if (status.currentLines.length === 0) {
          return {
            ...status,
            subtitle: afterMarker(line),
          }
        }

        return {
          ...status,
          subtitle: afterMarker(line),
          fragments: [
            ...status.fragments,
            createFragment(status.title, status.subtitle, status.currentLines),
          ],
          currentLines: [],
        }
      }

      // ignore
      if (startsWithAny(line, titleMarkers)) {
        return { ...status, title: afterMarker(line) }
      }

      // add lines to currentLines
      return { ...status, currentLines: [...status.currentLines, line] }
    },
    { title: '', subtitle: '', currentLines: [], fragments: [] }
  )

  // add last built up fragment
  const fragments = [
    ...reduced.fragments,
    createFragment(reduced.title, reduced.subtitle, reduced.currentLines),
  ]

  return fragments
}
