export default function getContextInjection() {
  const first = (xs, test) => {
    for (const x of xs) {
      if (test(x)) {
        return x
      }
    }
    return null
  }

  const contentEditableValue = () => {
    let selection = document
      .getSelection()
      .toString()
      .trim()
    if (!selection) {
      let anchorNode = document.getSelection().anchorNode as HTMLElement
      if (anchorNode) {
        if (anchorNode.querySelector) {
          anchorNode =
            anchorNode.querySelector('textarea') ||
            anchorNode.querySelector('input') ||
            anchorNode
        }
        if (anchorNode) {
          // works with contentEditable + textarea/input
          // @ts-ignore
          selection = anchorNode.textContent || anchorNode.value
        }
      }
    }
    return (selection || '').trim()
  }

  const rules = [
    {
      name: 'Zendesk',
      regex: /.+zendesk.com.+\/tickets\/.+/,
      script: () => {
        // for some reason there can sometimes be multiple subject fields
        const subjects = document.querySelectorAll('input[name=subject]')
        // @ts-ignore
        const title = (subjects[subjects.length] - 1).value
        return {
          title,
          selection: contentEditableValue(),
        }
      },
    },
    {
      name: 'Gmail',
      regex: /.+mail.google.com.+inbox\/.+/,
      script: () => {
        return {
          // @ts-ignore
          title: document.querySelector('h2.hP').innerText,
          selection: contentEditableValue(),
        }
      },
    },
  ]

  const url = document.location + ''
  const rule = first(rules, ({ regex }) => url.match(regex))

  const vals = rule
    ? rule.script()
    : {
        title: document.title,
        selection: contentEditableValue(),
      }

  return JSON.stringify(
    Object.assign({}, vals, {
      url: url,
    }),
  )
}
