import global from 'global'

export const setGlobal = (name: string, val: any) => {
  global[name] = val
}
