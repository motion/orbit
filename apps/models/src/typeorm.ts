const isBrowser = typeof global === 'undefined'

const {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} = isBrowser ? require('typeorm/browser') : require('typeorm')

export { BaseEntity, Entity, Column, PrimaryGeneratedColumn, OneToMany }

// avoid
export const setGlobal = (name, val) =>
  eval(
    `${typeof global === 'undefined' ? 'window' : 'global'}.${name} = ${val}`,
  )
