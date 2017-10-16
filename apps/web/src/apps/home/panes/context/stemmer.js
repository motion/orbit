const step2list = {
  ational: 'ate',
  tional: 'tion',
  enci: 'ence',
  anci: 'ance',
  izer: 'ize',
  bli: 'ble',
  alli: 'al',
  entli: 'ent',
  eli: 'e',
  ousli: 'ous',
  ization: 'ize',
  ation: 'ate',
  ator: 'ate',
  alism: 'al',
  iveness: 'ive',
  fulness: 'ful',
  ousness: 'ous',
  aliti: 'al',
  iviti: 'ive',
  biliti: 'ble',
  logi: 'log',
} // vowel in stem

const step3list = {
  icate: 'ic',
  ative: '',
  alize: 'al',
  iciti: 'ic',
  ical: 'ic',
  ful: '',
  ness: '',
}

const // consonant
c = '[^aeiou]'

const // vowel
v = '[aeiouy]'

const // consonant sequence
C = `${c}[^aeiouy]*`

const // vowel sequence
V = `${v}[aeiou]*`

const // [C]VC... is m>0
mgr0 = `^(${C})?${V}${C}`

const // [C]VC[V] is m=1
meq1 = `^(${C})?${V}${C}(${V})?$`

const // [C]VCVC... is m>1
mgr1 = `^(${C})?${V}${C}${V}${C}`

const s_v = `^(${C})?${v}`

function dummyDebug() {}

export default (w, debug = false) => {
  let stem
  let suffix
  let firstch
  let re
  let re2
  let re3
  let re4
  const origword = w

  const debugFunction = () => {}

  /*
  if (debug) {
    debugFunction = realDebug
  } else {
    debugFunction = dummyDebug
  }
  */

  if (w.length < 3) {
    return w
  }

  firstch = w.substr(0, 1)
  if (firstch == 'y') {
    w = firstch.toUpperCase() + w.substr(1)
  }

  // Step 1a
  re = /^(.+?)(ss|i)es$/
  re2 = /^(.+?)([^s])s$/

  if (re.test(w)) {
    w = w.replace(re, '$1$2')
    debugFunction('1a', re, w)
  } else if (re2.test(w)) {
    w = w.replace(re2, '$1$2')
    debugFunction('1a', re2, w)
  }

  // Step 1b
  re = /^(.+?)eed$/
  re2 = /^(.+?)(ed|ing)$/
  if (re.test(w)) {
    var fp = re.exec(w)
    re = new RegExp(mgr0)
    if (re.test(fp[1])) {
      re = /.$/
      w = w.replace(re, '')
      debugFunction('1b', re, w)
    }
  } else if (re2.test(w)) {
    var fp = re2.exec(w)
    stem = fp[1]
    re2 = new RegExp(s_v)
    if (re2.test(stem)) {
      w = stem
      debugFunction('1b', re2, w)

      re2 = /(at|bl|iz)$/
      re3 = new RegExp('([^aeiouylsz])\\1$')
      re4 = new RegExp(`^${C}${v}[^aeiouwxy]$`)

      if (re2.test(w)) {
        w = `${w}e`
        debugFunction('1b', re2, w)
      } else if (re3.test(w)) {
        re = /.$/
        w = w.replace(re, '')
        debugFunction('1b', re3, w)
      } else if (re4.test(w)) {
        w = `${w}e`
        debugFunction('1b', re4, w)
      }
    }
  }

  // Step 1c
  re = new RegExp(`^(.*${v}.*)y$`)
  if (re.test(w)) {
    var fp = re.exec(w)
    stem = fp[1]
    w = `${stem}i`
    debugFunction('1c', re, w)
  }

  // Step 2
  re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/
  if (re.test(w)) {
    var fp = re.exec(w)
    stem = fp[1]
    suffix = fp[2]
    re = new RegExp(mgr0)
    if (re.test(stem)) {
      w = stem + step2list[suffix]
      debugFunction('2', re, w)
    }
  }

  // Step 3
  re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/
  if (re.test(w)) {
    var fp = re.exec(w)
    stem = fp[1]
    suffix = fp[2]
    re = new RegExp(mgr0)
    if (re.test(stem)) {
      w = stem + step3list[suffix]
      debugFunction('3', re, w)
    }
  }

  // Step 4
  re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/
  re2 = /^(.+?)(s|t)(ion)$/
  if (re.test(w)) {
    var fp = re.exec(w)
    stem = fp[1]
    re = new RegExp(mgr1)
    if (re.test(stem)) {
      w = stem
      debugFunction('4', re, w)
    }
  } else if (re2.test(w)) {
    var fp = re2.exec(w)
    stem = fp[1] + fp[2]
    re2 = new RegExp(mgr1)
    if (re2.test(stem)) {
      w = stem
      debugFunction('4', re2, w)
    }
  }

  // Step 5
  re = /^(.+?)e$/
  if (re.test(w)) {
    var fp = re.exec(w)
    stem = fp[1]
    re = new RegExp(mgr1)
    re2 = new RegExp(meq1)
    re3 = new RegExp(`^${C}${v}[^aeiouwxy]$`)
    if (re.test(stem) || (re2.test(stem) && !re3.test(stem))) {
      w = stem
      debugFunction('5', re, re2, re3, w)
    }
  }

  re = /ll$/
  re2 = new RegExp(mgr1)
  if (re.test(w) && re2.test(w)) {
    re = /.$/
    w = w.replace(re, '')
    debugFunction('5', re, re2, w)
  }

  // and turn initial Y back to y
  if (firstch == 'y') {
    w = firstch.toLowerCase() + w.substr(1)
  }

  return w
}
