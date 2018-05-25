import root from 'global'

export const setGlobal = (name: string, val: any) => {
  root[name] = val
}
