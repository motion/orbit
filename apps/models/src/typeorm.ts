const isBrowser = eval(`typeof window !== 'undefined'`)

const {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} = isBrowser ? require('typeorm/browser') : eval(`require('typeorm')`)

export { BaseEntity, Entity, Column, PrimaryGeneratedColumn, OneToMany }

// avoid
export const setGlobal = (name: string, val: any) => {
  let Thing = val
  eval(`${typeof global === 'undefined' ? 'window' : 'global'}.${name} = Thing`)
}
