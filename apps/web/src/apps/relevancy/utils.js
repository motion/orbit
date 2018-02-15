import { capitalize } from "lodash"

export const sentences = s =>
  s.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|")

export const encodeEntity = e => {
  return `::${e.split(" ").join("-")}::`
}

window.ee = encodeEntity

export const decodeEntity = e => e.split("::")[1].replace(/\-/g, " ")
