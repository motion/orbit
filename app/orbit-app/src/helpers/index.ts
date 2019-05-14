export const deepClone = obj => (obj ? JSON.parse(JSON.stringify(obj)) : obj)

export const sleep = ms => new Promise(res => setTimeout(res, ms))
