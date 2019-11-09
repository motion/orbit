import { CAMEL_TO_SNAKE, SNAKE_TO_CAMEL } from './constants'

export const px = (x: number | string) =>
  typeof x === 'number' ? `${x}px` : `${+x}` === x ? `${x}px` : x

export function camelToSnake(key: string) {
  return CAMEL_TO_SNAKE[key] || key
}

export function snakeToCamel(key: string) {
  return SNAKE_TO_CAMEL[key] || key
}

// thx darksky: https://git.io/v9kWO
export function stringHash(str: string): number {
  let res = 5381
  let i = 0
  let len = str.length
  while (i < len) {
    res = (res * 33) ^ str.charCodeAt(i++)
  }
  return res >>> 0
}
