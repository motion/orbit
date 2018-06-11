const RE_ALPHANUMERIC = new RegExp('^\\w?$')
const RE_TAG = new RegExp('<(.+?)>', 'g')
const RE_BOLD = new RegExp('\\*([^\\*]+?)\\*', 'g')
const RE_ITALIC = new RegExp('_([^_]+?)_', 'g')
const RE_FIXED = new RegExp('`([^`]+?)`', 'g')

// TODO sanitize

function payloads(tag, start = 0) {
  return pipeSplit(tag.substr(start, tag.length - start))
}

function pipeSplit(payload) {
  return payload.split('|')
}

function tag(tag, attributes, payload = '') {
  if (!payload) {
    payload = attributes
    attributes = {}
  }
  let html = '<'.concat(tag)
  for (var attribute in attributes) {
    if (attributes.hasOwnProperty(attribute)) {
      html = html.concat(' ', attribute, '="', attributes[attribute], '"')
    }
  }
  return html.concat('>', payload, '</', tag, '>')
}

function matchTag(match) {
  let action = match[1].substr(0, 1)
  let p
  switch (action) {
    case '!':
      return tag('span', { class: 'slack-cmd' }, payloads(match[1], 1)[0])
    case '#':
      p = payloads(match[1], 2)
      return tag(
        'span',
        { class: 'slack-channel' },
        p.length === 1 ? p[0] : p[1],
      )
    case '@':
      p = payloads(match[1], 2)
      return tag('span', { class: 'slack-user' }, p.length === 1 ? p[0] : p[1])
    default:
      const imgMatch = match[1].match(/(http[^|]+\.(png|jpe?g|gif))|.*/g)
      if (imgMatch && imgMatch.length === 3) {
        console.log(`<img src="${imgMatch[0]}" />`)
        return `<img src="${imgMatch[0]}" />`
      }
      p = payloads(match[1])
      return tag('a', { href: p[0] }, p.length === 1 ? p[0] : p[1])
  }
}

function matchBold(match) {
  return safeMatch(match, tag('strong', payloads(match[1])), '*')
}

function matchItalic(match) {
  return safeMatch(match, tag('em', payloads(match[1])), '_')
}

function matchFixed(match) {
  return safeMatch(match, tag('code', payloads(match[1])))
}

function notAlphanumeric(input) {
  return !RE_ALPHANUMERIC.test(input)
}

function notRepeatedChar(trigger, input) {
  return !trigger || trigger !== input
}

function safeMatch(match, tag, trigger?) {
  let prefix_ok = match.index === 0
  let postfix_ok = match.index === match.input.length - match[0].length
  if (!prefix_ok) {
    var charAtLeft = match.input.substr(match.index - 1, 1)
    prefix_ok =
      notAlphanumeric(charAtLeft) && notRepeatedChar(trigger, charAtLeft)
  }
  if (!postfix_ok) {
    var charAtRight = match.input.substr(match.index + match[0].length, 1)
    postfix_ok =
      notAlphanumeric(charAtRight) && notRepeatedChar(trigger, charAtRight)
  }
  if (prefix_ok && postfix_ok) {
    return tag
  }
  return false
}

export default function publicParse(text) {
  if (typeof text === 'string') {
    var patterns = [
      { p: RE_TAG, cb: matchTag },
      { p: RE_BOLD, cb: matchBold },
      { p: RE_ITALIC, cb: matchItalic },
      { p: RE_FIXED, cb: matchFixed },
    ]
    for (const pattern of patterns) {
      let original = text
      let result
      while ((result = pattern.p.exec(original)) !== null) {
        const replace = pattern.cb(result)
        if (replace) {
          text = text.replace(result[0], replace)
        }
      }
    }
  }

  return text
}
