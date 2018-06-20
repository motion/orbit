// compare model
export function modelEqual(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function modelsEqual(a: any[], b: any[]) {
  if (a.length !== b.length) {
    return false
  }
  for (const [index, aItem] of a.entries()) {
    if (!modelEqual(aItem, b[index])) {
      return false
    }
  }
  return true
}
