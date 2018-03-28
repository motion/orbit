const isBrowser = eval(`typeof window !== 'undefined'`)

const {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} = isBrowser ? require('typeorm/browser') : eval(`require('typeorm')`)

console.log('BaseEntity', BaseEntity)

export { BaseEntity, Entity, Column, PrimaryGeneratedColumn, OneToMany }

// avoid
export const setGlobal = (name, val) => {
  let Thing = val
  eval(`${typeof global === 'undefined' ? 'window' : 'global'}.${name} = Thing`)
}
