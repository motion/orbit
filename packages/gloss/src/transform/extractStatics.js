export default function() {
  return {
    visitor: {
      Class(path) {
        const props = []
        const body = path.get('body')
        for (const path of body) {
          if (path.isClassProperty()) {
            props.push(path)
          }
        }
      },
    },
  }
}
